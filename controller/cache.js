/**
 * Controller for the "Cache"
 */
const Cache = require("../middleware/cache");
const CacheDB = require("../models/cache");
const dateFNS = require("date-fns");

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
   * @returns {Object} Containing data as <key, data>
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
          console.log("Found in DB");
          // Set the cache with data found in DB
          data = this.set(key, found.data);
          console.log(data)
        } else {
          console.log("Key does not exist in DB.. Generating a new one");
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

        // Check for expiry
        if (this.isEntryExpired(key)) {
          console.log("Entry expired, regenerating");
          const { data: updatedData } = await this.updateEntry(key);
          data = updatedData;
        }

        // Reset TTL
        Cache.ttl(key);
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
   * Updates the database at the given key
   * with a new random string and
   * updates the TTL
   *
   * @param {string} key The key to update
   */
  async updateEntry(key) {
    try {
      const randomString = uniqueNamesGenerator({
        dictionaries: [adjectives, colors, animals],
      });

      // Update key in the database
      const { nModified } = await CacheDB.updateOne(
        { key },
        {
          $set: {
            data: randomString,
          },
        }
      );

      // Break operation if database wasnt updated
      if (nModified === 0) throw new Error("Update failed");

      // Set the cache with the newly generated key
      data = this.set(key, randomString);

      // Reset TTL
      Cache.ttl(key);

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
   * @returns {string} The data passed
   * in the function
   */
  set(key, data) {
    try {
      // Save it to the cache
      const status = Cache.set(key, data);

      if (!status) throw new Error("Cache could not be set, try again");

      return data;
    } catch (error) {
      // When cache is full
      if (error.name === "ECACHEFULL") {
        console.log('Cache is full, overwriting an entry');
        return this.overWriteEntry(key, data);
      }

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

  /**
   * Removes a key from the cache
   *
   * @returns {number} 1 when deleted
   */
  async deleteCacheEntry(key) {
    try {
      return Cache.del(key);
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  /**
   * Overwrites a key in the cache
   * to make space for the new given
   * key
   * 
   * Checks for the following:
   * 
   * 1. If an expired key exists in the cache,
   * it is removed and the new key is added
   * 
   * 2. If no key is expired then the very first
   * key in the entry is removed and replaced
   * 
   * @param {string} key The new key
   * that will over write one of the
   * keys in the cache 
   * @param {string} data The data
   * that belongs to the given key
   */
  overWriteEntry(key, data) {
    try {       
      const keys = Cache.keys();

      let result = null;
      let isEntryOverwritten = false;
      keys.every((singleKey) => {
        if (this.isEntryExpired(singleKey)) {
          // delete expired key
          this.deleteCacheEntry(singleKey);

          // set the key that is new
          result = this.set(key, data);
          isEntryOverwritten = true;

          // stop looping the keys
          return false;
        }

        // continue looping
        return true;
      });

      if (!isEntryOverwritten) {
        this.deleteCacheEntry(keys[0]);

        result = this.set(key, data);
      }

      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  /**
   * Indicates whether key is
   * expired or not
   * 
   * @param {string} key Key to check
   * expiry for 
   * 
   * @returns {boolean} true if
   * key is expired
   */
  isEntryExpired(key) {
    try {
      // Check if entry has expired
      const TTL = dateFNS.toDate(Cache.getTtl(key));

      return dateFNS.isBefore(TTL, new Date)
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
};
