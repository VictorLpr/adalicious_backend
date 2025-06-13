const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM meals');
    res.status(200).send(result.rows);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

module.exports = router;
