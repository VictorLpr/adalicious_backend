const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM orders');
    res.status(200).send(result.rows);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const orderId = req.params.id;
    const result = await db.query(
      `SELECT q.quantity, m.title, q.quantity * m.price AS line_price
        FROM quantities q 
        JOIN orders o ON o.id = q.order_id
        JOIN meals m ON q.meal_id = m.id
        WHERE o.id = $1`,
      [orderId],
    );
    if (result.rows[0]) {
      res.status(200).send(result.rows);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.post('/', async (req, res) => {
  try {
    const {quantities, userId} = req.body;
    // quantities = [{mealsId : "",
    //              quantity : ""
    //             }, ...]
    const orderQuery = await db.query('INSERT INTO orders (status_id, user_id) VALUES ($1, $2) RETURNING id', [1, userId]);
    const orderId = orderQuery.rows[0].id;
    quantities.forEach(async (quantity) => {
      const quantityQuery = await db.query('INSERT INTO quantities (order_id, quantity, meal_id) VALUES ($1, $2, $3)', [
        orderId,
        quantity.quantity,
        quantity.mealsId,
      ]);
    });

    res.status(200).send(orderId);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const statusId = req.body.statusId;
    const orderId = req.params.id;
    console.log(statusId + ' ' + orderId);
    const result = await db.query('UPDATE orders SET status_id = $1 WHERE id = $2', [statusId, orderId]);
    if (result.rowCount) {
      res.status(200).send(result);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const orderId = req.params.id;
    const result = await db.query('DELETE FROM orders WHERE id=$1', [orderId]);
    if (result.rowCount) {
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

module.exports = router;
