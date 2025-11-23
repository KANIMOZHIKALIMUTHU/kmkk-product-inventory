import React, { useState, useEffect } from 'react';
import axios from 'axios';

import ProductTable from './components/ProductTable';
import SearchBar from './components/SearchBar';
import FilterDropdown from './components/FilterDropdown';
import ImportExportButtons from './components/ImportExportButtons';
import InventoryHistorySidebar from './components/InventoryHistorySidebar';
import AddProductModal from './components/AddProductModal';

import './App.css';

const BACKEND_URL = 'http://localhost:5000/api/products'; // Update for deployed backend

function App() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = products;

    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (categoryFilter) {
      filtered = filtered.filter(p => p.category === categoryFilter);
    }

    setFilteredProducts(filtered);
  }, [searchQuery, categoryFilter, products]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(BACKEND_URL);
      setProducts(res.data);
    } catch (error) {
      console.error('Failed to load products', error);
    }
  };

  const handleEdit = async (id, updatedData) => {
  try {
    const res = await axios.put(`${BACKEND_URL}/${id}`, updatedData, {
      headers: { 'Content-Type': 'application/json' }
    });
    setProducts(prev => prev.map(p => (p.id === id ? res.data : p)));
  } catch (error) {
    alert('Failed to update product: ' + (error.response?.data?.error || error.message));
    console.error(error);
  }
};

  const handleDelete = (id) => {
    // Implement when ready or optional per assignment
    alert('Delete feature is optional and not implemented');
  };

  return (
    <div className="app">
      <header className="header">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <FilterDropdown products={products} value={categoryFilter} onChange={setCategoryFilter} />
        <button className="add-btn" onClick={() => setShowAddModal(true)}>Add New Product</button>
        <ImportExportButtons fetchProducts={fetchProducts} backendUrl={BACKEND_URL} />
      </header>

      <ProductTable
        products={filteredProducts}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRowClick={setSelectedProduct}
      />

      {selectedProduct && (
        <InventoryHistorySidebar productId={selectedProduct.id} onClose={() => setSelectedProduct(null)} />
      )}

      {showAddModal && (
        <AddProductModal onClose={() => setShowAddModal(false)} fetchProducts={fetchProducts} />
      )}
    </div>
  );
}

export default App;
