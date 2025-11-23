import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './index.css';

export default function InventoryHistorySidebar({ productId, onClose }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/products/${productId}/history`);
      setHistory(res.data);
    } catch (error) {
      console.error('Failed to fetch inventory history', error);
    }
  };

  return (
    <div className="sidebar">
      <button className="close-btn" onClick={onClose}>X</button>
      <h3>Inventory Change History</h3>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Old Stock</th>
            <th>New Stock</th>
            <th>Changed By</th>
          </tr>
        </thead>
        <tbody>
          {history.map(h => (
            <tr key={h.id}>
              <td>{new Date(h.change_date).toLocaleString()}</td>
              <td>{h.old_quantity}</td>
              <td>{h.new_quantity}</td>
              <td>{h.user_info}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
