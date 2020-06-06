var express = require('express');
var router = express.Router();

const cacheController = require('../controller/cache')

/* GET all cache items */
router.get('/', async (req, res, next) => {
    const result = await cacheController.getAll();

    res.send(result);
});

module.exports = router;
