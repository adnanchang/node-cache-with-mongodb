let mongoose = require("mongoose");

// Cache Schema
let cacheSchema = mongoose.Schema({
  key: {
    type: String,
  },

  data: {
    type: String,
  },
});

const Cache = (module.exports = mongoose.model("Cache", cacheSchema));
