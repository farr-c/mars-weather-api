const express = require('express');

const marsWeather = require('./mars-weather');
const discord = require('./discord');


const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏'
  });
});


router.post('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏'
  });
});


router.use('/mars-weather', marsWeather);
router.use('/discord', discord);


module.exports = router;
