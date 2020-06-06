var express = require("express");
var router = express.Router();

const cacheController = require("../controller/cache");

/* GET all cache items */
router.get("/", async (req, res, next) => {
  const result = await cacheController.getAll();

  res.send(result);
});

/* GET cache item with a key */
router.get("/item/:key", async (req, res, next) => {
  // Return if ID not provided
  if (!req.params.key) {
    res.status(400).send("A key is required to fetch an item's data");
  }

  const result = await cacheController.get(req.params.key);

  res.send(result);
});

/* GET cache item with a key */
router.delete("/", async (req, res, next) => {
  const result = await cacheController.clearCache();

  res.status(200).send(`Cache was cleared, ${result} items deleted`);
});

module.exports = router;
