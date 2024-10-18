const mongoose = require('mongoose');
const { Schema } = mongoose;

const ConfigurationSchema = new Schema({
  last_sync: {type:Date},
  
});

module.exports = mongoose.model('Configuration', ConfigurationSchema);
