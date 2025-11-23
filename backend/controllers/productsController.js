const db = require('../db');
const csv = require('csv-parser');
const fs = require('fs');
const { validationResult, body } = require('express-validator');
const { parse } = require('json2csv');

const getProducts = (req, res) => {
  db.all('SELECT * FROM products', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

const searchProducts = (req, res) => {
  const name = req.query.name || '';
  db.all(
    'SELECT * FROM products WHERE LOWER(name) LIKE ?',
    [`%${name.toLowerCase()}%`],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
};

const updateProduct = (req, res) => {
  const id = req.params.id;
  const { name, unit, category, brand, stock, status } = req.body;

  // Validate stock and name presence & uniqueness except current product
  if (typeof stock !== 'number' || stock < 0)
    return res.status(400).json({ error: 'Stock must be a non-negative number' });
  if (!name) return res.status(400).json({ error: 'Name is required' });

  db.get('SELECT id, stock FROM products WHERE id = ?', [id], (err, product) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!product) return res.status(404).json({ error: 'Product not found' });

    db.get(
      'SELECT id FROM products WHERE LOWER(name) = ? AND id != ?',
      [name.toLowerCase(), id],
      (err, duplicate) => {
        if (err) return res.status(500).json({ error: err.message });
        if (duplicate)
          return res.status(400).json({ error: 'Product name must be unique' });

        const oldStock = product.stock;
        const changeDate = new Date().toISOString();

        db.run(
          `UPDATE products SET name=?, unit=?, category=?, brand=?, stock=?, status=? WHERE id=?`,
          [name, unit, category, brand, stock, status, id],
          function (err) {
            if (err) return res.status(500).json({ error: err.message });

            if (oldStock !== stock) {
              db.run(
                `INSERT INTO inventory_history (product_id, old_quantity, new_quantity, change_date, user_info)
                 VALUES (?, ?, ?, ?, ?)`,
                [id, oldStock, stock, changeDate, 'admin'],
                (err) => {
                  if (err) console.error('Failed to log inventory change', err);
                }
              );
            }

            db.get('SELECT * FROM products WHERE id = ?', [id], (err, updatedProduct) => {
              if (err) return res.status(500).json({ error: err.message });
              res.json(updatedProduct);
            });
          }
        );
      }
    );
  });
};

const importProducts = (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'CSV file is required' });

  const results = [];
  const added = [];
  const skipped = [];
  const duplicates = [];

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      let addedCount = 0;
      let skippedCount = 0;
      let pending = results.length;

      results.forEach((product) => {
        const name = product.name.trim();
        const unit = product.unit || '';
        const category = product.category || '';
        const brand = product.brand || '';
        const stock = Number(product.stock) || 0;
        const status = product.status || '';
        const image = product.image || '';

        if (!name) {
          skippedCount++;
          pending--;
          if (pending === 0)
            finalizeResponse(addedCount, skippedCount, duplicates, res, req.file.path);
          return;
        }

        db.get(
          'SELECT id FROM products WHERE LOWER(name) = ?',
          [name.toLowerCase()],
          (err, row) => {
            if (err) {
              skippedCount++;
            } else if (row) {
              duplicates.push({ name, existingId: row.id });
            } else {
              db.run(
                `INSERT INTO products (name, unit, category, brand, stock, status, image)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [name, unit, category, brand, stock, status, image],
                (err) => {
                  if (!err) addedCount++;
                  else skippedCount++;
                }
              );
            }
            pending--;
            if (pending === 0)
              finalizeResponse(addedCount, skippedCount, duplicates, res, req.file.path);
          }
        );
      });

      if (results.length === 0) {
        fs.unlinkSync(req.file.path);
        res.json({ added: 0, skipped: 0, duplicates: [] });
      }
    });
};

function finalizeResponse(added, skipped, duplicates, res, filepath) {
  fs.unlinkSync(filepath);
  res.json({ added, skipped, duplicates });
}

const exportProducts = (req, res) => {
  db.all('SELECT * FROM products', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    const fields = ['id', 'name', 'unit', 'category', 'brand', 'stock', 'status', 'image'];
    const opts = { fields };
    try {
      const csv = parse(rows, opts);
      res.header('Content-Type', 'text/csv');
      res.attachment('products.csv');
      res.send(csv);
    } catch (err) {
      res.status(500).json({ error: 'Failed to export CSV' });
    }
  });
};

const getInventoryHistory = (req, res) => {
  const productId = req.params.id;
  db.all(
    'SELECT * FROM inventory_history WHERE product_id = ? ORDER BY change_date DESC',
    [productId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
};

const addProduct = (req, res) => {
  const { name, unit, category, brand, stock, status, image } = req.body;

  if (!name || stock < 0) {
    return res.status(400).json({ error: 'Invalid product data' });
  }

  db.get('SELECT id FROM products WHERE LOWER(name) = ?', [name.toLowerCase()], (err, row) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (row) return res.status(400).json({ error: 'Product name already exists' });

    db.run(
      `INSERT INTO products (name, unit, category, brand, stock, status, image)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, unit, category, brand, stock, status, image],
      function (err) {
        if (err) return res.status(500).json({ error: 'Failed to add product' });

        const newProductId = this.lastID;
        db.get('SELECT * FROM products WHERE id = ?', [newProductId], (err, product) => {
          if (err) return res.status(500).json({ error: 'Failed to fetch new product' });
          res.status(201).json(product);
        });
      }
    );
  });
};

module.exports = {
  getProducts,
  searchProducts,
  updateProduct,
  importProducts,
  exportProducts,
  getInventoryHistory,
  addProduct,
};
