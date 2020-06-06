/**
 * Lo and Behold the cache that lives at my will and dies at my will
 */
const NodeCache = require("node-cache");
const cacheController = require('../controller/cache');

const theCache = new NodeCache({ stdTTL: 120 });

theCache.on( "expired", function( key, value ){
	// Remove entry from database
});

module.exports = theCache
