const mongoose = require('mongoose');

const { Schema } = mongoose;

const MovieSchema = new Schema({
  id: Number,
  title: String,
  overview: String,
  genre_ids: [Number],
  release_date: {type:Date},
  rating: { type: Number, default: 0 },
  vote_average:{type:Number,default:0},
  vote_count:{type:Number,default:0}
});

module.exports = mongoose.model('Movie', MovieSchema);
