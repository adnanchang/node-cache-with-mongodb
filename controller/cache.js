/**
 * Controller for the "Cache"
 */
let Cache = require('../middleware/cache');
let CacheDB = require('../models/cache');

 module.exports = {
     /**
      * Gets all data inside the cache
      */
     async getAll() {
        const data = Cache.keys();

        return data;
     }
 }