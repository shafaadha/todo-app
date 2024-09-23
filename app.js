const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const todoRoutes = require('./routes/todoRoutes');
const path = require('path');
const app = express();
const methodOverride = require('method-override')

app.use(methodOverride('_method'))
// Connect to MongoDB
require('./utils/db')

// Use EJS layouts
app.use(expressLayouts);

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Specify the layout file if you have one
app.set('layout', 'layouts/layout');  // Ensure this is correct

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', todoRoutes);

// Start server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
