const express = require('express');
const axios = require('axios');
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');

const limiter = rateLimit({
  windowMs: 30 * 1000,
  max: 10,
});

const speedLimiter = slowDown({
  windowMs: 30 * 1000,
  delayAfter: 1,
  delayMs: 500
});

const router = express.Router();

const BASE_URL = 'https://discord.com/api/webhooks/937205537257422869/4oIgvJZ5JFa-HiHz5vQyq2Af9DWLhxcYU_E-OkQRXw3PxiuQCqk0qyIXOD6Fo4mKOyzl';

let cachedData;
let cacheTime;
console.log("pee");
const apiKeys = new Map();
apiKeys.set('12345', true);

router.post('/', limiter, speedLimiter, (req, res, next) => {
  const apiKey = req.get('X-API-KEY');
  console.log(req.body);
  if (apiKeys.has(apiKey)) {
    next();
  } else {
    const error = new Error('Invalid API KEY');
    next(error);
  }
}, async (req, res, next) => {
  // in memory cache
  if (cacheTime && cacheTime > Date.now() - 30 * 1000) {
    // BTW - set a cache header so browsers work WITH you.
    // WOW awesome stuff I learned at least 2 new things today @CodingGarden - what is you opinion on using manual cache instead of 'Cache-Control' ie res set('Cache-Control', 'public, max-age=300, s-maxage=600') 
    return res.json(cachedData);
  }
  try {
    //
    const params = new URLSearchParams({
      //api_key: process.env.NASA_API_KEY,
      //feedtype: 'json',
     // ver: '1.0'
    });
    //
    // 1. make a request to nasa api
    //const { data } = await axios.post(`${BASE_URL}${params}`);
    const { data } = await axios.post(BASE_URL, req.body);
    // 2. respond to this request with data from nasa api
    cachedData = data;
    cacheTime = Date.now();

    data.cacheTime = cacheTime;
    return res.json(data);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
