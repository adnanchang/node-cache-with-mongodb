/**
 * Lo and Behold the cache that lives at my will and dies at my will
 */
const NodeCache = require("node-cache");

const theCache = new NodeCache({ stdTTL: 100 });

module.exports = theCache
