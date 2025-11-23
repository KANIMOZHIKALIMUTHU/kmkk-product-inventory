const express = require('express');
const multer = require('multer');
const upload = multer({ dest: './uploads' });
const {
  getProducts,
  searchProducts,
  updateProduct,
  importProducts,
  exportProducts,
  getInventoryHistory,
  addProduct
} = require('../controllers/productsController');

const router = express.Router();

router.get('/', getProducts);
router.get('/search', searchProducts);
router.put('/:id', updateProduct);
router.post('/import', upload.single('csvFile'), importProducts);
router.get('/export', exportProducts);
router.get('/:id/history', getInventoryHistory);
router.post('/', addProduct);

module.exports = router;
