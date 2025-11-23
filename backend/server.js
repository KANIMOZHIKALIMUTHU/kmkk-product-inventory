require('dotenv').config();
const express = require('express');
const cors = require('cors');
const productsRouter = require('./routes/products');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Route prefix for products API
app.use('/api/products', productsRouter);

// Default route
app.get('/', (req, res) => {
  res.send('Product Inventory Management API is running.');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
