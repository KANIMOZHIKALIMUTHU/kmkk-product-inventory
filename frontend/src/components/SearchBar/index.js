import React from 'react';
import './index.css';

export default function SearchBar({ value, onChange }) {
  return (
    <input
      type="text"
      className="search-bar"
      placeholder="Search products..."
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  );
}
