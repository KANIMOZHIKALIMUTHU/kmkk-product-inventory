import React, { useState } from 'react';
import './index.css';

export default function ProductTable({ products, onEdit, onDelete, onRowClick }) {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const startEditing = (product) => {
    setEditingId(product.id);
    setEditData(product);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditData({});
  };

  const saveEditing = () => {
    const dataToSend = { ...editData, stock: Number(editData.stock) };
    onEdit(editingId, dataToSend);
    setEditingId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <table className="product-table">
      <thead>
        <tr>
          <th>Image</th><th>Name</th><th>Unit</th><th>Category</th><th>Brand</th><th>Stock</th><th>Status</th><th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map(product => (
          <tr key={product.id} onClick={() => onRowClick(product)}>
            <td>{product.image ? <img src={product.image} alt={product.name} className="product-img" /> : 'N/A'}</td>
            {editingId === product.id ? (
              <>
                <td><input name="name" value={editData.name} onChange={handleChange} /></td>
                <td><input name="unit" value={editData.unit} onChange={handleChange} /></td>
                <td><input name="category" value={editData.category} onChange={handleChange} /></td>
                <td><input name="brand" value={editData.brand} onChange={handleChange} /></td>
                <td><input type="number" name="stock" value={editData.stock} onChange={handleChange} min="0" /></td>
                <td>{editData.stock > 0 ? <span className="stock-in">In Stock</span> : <span className="stock-out">Out of Stock</span>}</td>
                <td>
                  <button onClick={saveEditing}>Save</button>
                  <button onClick={cancelEditing}>Cancel</button>
                </td>
              </>
            ) : (
              <>
                <td>{product.name}</td>
                <td>{product.unit}</td>
                <td>{product.category}</td>
                <td>{product.brand}</td>
                <td>{product.stock}</td>
                <td className={product.stock > 0 ? 'stock-in' : 'stock-out'}>
                  {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </td>
                <td>
                  <button onClick={(e) => { e.stopPropagation(); startEditing(product); }}>Edit</button>
                  <button onClick={(e) => { e.stopPropagation(); onDelete(product.id); }}>Delete</button>
                </td>
              </>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
