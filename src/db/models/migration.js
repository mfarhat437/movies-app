const mongoose = require('mongoose');

const { Schema } = mongoose;

const MigrationSchema = new Schema({
  lastRun: { type: String, trim: true },
  migrations: [{ type: Schema.Types.Mixed}],

});

module.exports = mongoose.model('Migration', MigrationSchema);
