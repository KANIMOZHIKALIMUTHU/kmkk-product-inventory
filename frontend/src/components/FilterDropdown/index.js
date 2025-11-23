import React from 'react';
import './index.css';

export default function FilterDropdown({ products, value, onChange }) {
  const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean)));

  return (
    <select
      className="filter-dropdown"
      value={value}
      onChange={e => onChange(e.target.value)}
    >
      <option value="">All Categories</option>
      {categories.map(cat => (
        <option key={cat} value={cat}>{cat}</option>
      ))}
    </select>
  );
}
