var express = require("express");
var router = express.Router();

const cacheController = require("../controller/cache");

/* GET all cache items */
router.get("/", async (req, res, next) => {
  try {
    const result = await cacheController.getAll();

    res.send(result);
  } catch (error) {
    res.status(400).send("Whoops! Could not retrieve the entries. Try again");
  }

});

/* GET cache item with a key */
router.get("/item/:key", async (req, res, next) => {
  // Return if key not provided
  if (!req.params.key) {
    res.status(400).send("A key is required to fetch an item's data");
  }

  try {
    const result = await cacheController.get(req.params.key);

    res.send(result);
  } catch (error) {
    res.status(400).send("Whoops! Could not get the given key. Try again");
  }
});

/* UPDATE cache item with a key */
router.put("/item/:key", async (req, res, next) => {
  // Return if key not provided
  if (!req.params.key) {
    res.status(400).send("A key is required to update  an item's data");
  }

  try {
    const result = await cacheController.updateEntry(req.params.key);
    res.send(result);
  } catch (error) {
    res.status(400).send("Whoops! Could not update entry. Try again");
  }
});

/* DELETE all cache items */
router.delete("/", async (req, res, next) => {
  try {
    const result = await cacheController.clearCache();

    res.status(200).send(`Cache was cleared, ${result} items deleted`);
  } catch (error) {
    res.status(400).send("Whoops! Could not delete the entries. Try again");
  }
});

/* DELETE cache item with a key */
router.delete("/item/:key", async (req, res, next) => {
  // Return if key not provided
  if (!req.params.key) {
    res.status(400).send("A key is required to delete an item");
  }

  try {
    await cacheController.deleteCacheEntry(req.params.key);
    res.status(200).send(`Cache item was deleted`);
  } catch (error) {
    res.status(400).send("Whoops! Could not delete entry. Try again");
  }
});

module.exports = router;
