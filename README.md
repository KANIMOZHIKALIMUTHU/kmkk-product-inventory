# Inventory Management System

## Overview
This is a web-based Inventory Management System built with React for the frontend and a RESTful API backend. It allows users to manage product inventory with features including product listing, adding new products, editing product details, importing/exporting data, and viewing inventory history.

## Features
- Product listing with inline editing
- Add new products via modal form with detailed fields
- Import and export product data in CSV format
- Inventory change history sidebar for audit trail
- Responsive and user-friendly UI
- Search and filter products by category

## Technologies Used
- React for frontend UI
- Axios for API communication
- RESTful backend API (Node.js/Express or other)
- CSS Modules for component-scoped styling

## Installation
1. Clone the repository
2. Run `npm install` to install frontend dependencies
3. Setup and run backend API server separately
4. Run `npm start` to launch frontend in development mode

## Usage
- Navigate to the product dashboard to view current inventory
- Use Add Product modal to add new products with multiple fields
- Edit product inline in the table and save changes
- Import CSV files to bulk upload products
- Export current product list to CSV file
- Click on a product row to view detailed inventory change history

## Folder Structure
- `/src/components`: React components grouped by feature
- `/src/api`: Axios API service functions

## Future Enhancements
- User authentication and role-based access control
- Real-time inventory updates with WebSockets
- Advanced reporting and analytics
- Mobile-responsive design improvements
