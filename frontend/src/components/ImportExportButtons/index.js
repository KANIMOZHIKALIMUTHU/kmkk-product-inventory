import React, { useRef } from 'react';
import axios from 'axios';
import './index.css';

export default function ImportExportButtons({ fetchProducts, backendUrl }) {
  const fileInputRef = useRef();

  const handleImportClick = () => fileInputRef.current.click();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('csvFile', file);

    try {
      await axios.post(`${backendUrl}/import`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Import successful');
      fetchProducts();
    } catch (error) {
      alert('Import failed');
    }
  };

  const handleExportClick = () => {
    window.open(`${backendUrl}/export`, '_blank');
  };

  return (
    <div className="modal">
      <button onClick={handleImportClick}>Import CSV</button>
      <input
        className="file-input"
        type="file"
        accept=".csv"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <button onClick={handleExportClick}>Export CSV</button>
    </div>
  );
}
