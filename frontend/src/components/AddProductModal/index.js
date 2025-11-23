import React, { useState } from 'react';
import axios from 'axios';
import './index.css';

export default function AddProductModal({ onClose, fetchProducts }) {
  const [formData, setFormData] = useState({
    name: '',
    unit: '',
    category: '',
    brand: '',
    stock: 0,
    status: 'In Stock',
    image: ''
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:5000/api/products', formData); // You need to implement POST endpoint in backend
      alert('Product added');
      fetchProducts();
      onClose();
    } catch (error) {
      alert('Failed to add product');
    }
  };

  return (
    <div className="add-product-modal" onClick={onClose}>
      <div onClick={e => e.stopPropagation()}>
        <h2>Add New Product</h2>
        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="Name" onChange={handleChange} required />
          <input name="unit" placeholder="Unit" onChange={handleChange} />
          <input name="category" placeholder="Category" onChange={handleChange} />
          <input name="brand" placeholder="Brand" onChange={handleChange} />
          <input type="number" name="stock" placeholder="Stock" onChange={handleChange} min="0" />
          <input name="status" placeholder="Status" onChange={handleChange} />
          <input name="image" placeholder="Image URL" onChange={handleChange} />
          <button type="submit">Add</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
}
