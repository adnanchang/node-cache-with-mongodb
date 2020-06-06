/**
 * Controller for the "Cache"
 */
let Cache = require("../middleware/cache");
let CacheDB = require("../models/cache");

const {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} = require("unique-names-generator");

module.exports = {
  /**
   * Gets all data inside the cache
   *
   * @returns {Object} Containing objects as <key, data> pair
   */
  async getAll() {
    try {
      const keys = Cache.keys();

      const data = Cache.mget(keys);

      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  /**
   * Get the data corresponding to the
   * provided key
   *
   * @param {string} key The key to
   * search in the cache
   *
   * @returns {Object} { key: data }
   */
  async get(key) {
    try {
      let data = Cache.get(key);

      if (data === undefined) {
        console.log("Cache miss");

        // Find key in database if not in cache
        const found = await CacheDB.findOne({ key });

        if (found) {
          console.log('Found in DB')
          // Set the cache with data found in DB
          data = this.set(key, found.data);
        } else {
          console.log('Key does not exist in DB.. Generating a new one')
          // Generate new entry since key does not exist
          const randomString = uniqueNamesGenerator({
            dictionaries: [adjectives, colors, animals],
          });

          // Add key in the database
          await this.setDb(key, randomString);

          // Set the cache with the newly generated key
          data = this.set(key, randomString);
        }
      } else {
        console.log("Cache hit");
      }

      return {
        key,
        data,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  /**
   * Saves random data for
   * given key in the Cache
   *
   * @param {string} key
   * @param {string} data
   *
   * @returns {boolean} Only returns true
   * when cache was set
   */
  set(key, data) {
    try {
      // Save it to the cache
      const status = Cache.set(key, data);

      if (!status) throw new Error("Cache could not be set, try again");

      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  /**
   * Saves random data for
   * given key in the Database
   *
   * @param {string} key
   * @param {string} data
   *
   * @returns {boolean} Only returns true
   * when entry was created
   */
  async setDb(key, data) {
    try {
      // Save the string in the DB
      const newData = new CacheDB({
        key,
        data,
      });

      await newData.save();

      return true;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  /**
   * Removes all cache variables
   *
   * @returns {number} number of items deleted
   */
  async clearCache() {
    try {
      const keys = Cache.keys();

      return Cache.del(keys);
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
};
