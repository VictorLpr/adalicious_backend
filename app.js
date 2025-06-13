const express = require('express');
const app = express();
const cors = require('cors');

require('dotenv').config();

app.use(cors());
app.use(express.json());

const menuRoutes = require('./routes/menu');
const orderRoutes = require('./routes/order');

const port = 5000;

app.use('/menu', menuRoutes);
app.use('/order', orderRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
