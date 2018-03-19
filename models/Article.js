var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  link: {
    type: String,
    required: true,
    trim: true
  },
  post_id: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  company: {
    type: String,
    // required: true,
    trim: true
  },
  location:{
    type: String,
    // required: true,
    trim: true
  },
  posted_date: {
    type: Date,
    required: true,
    trim: true

  },
  scraped: {
    type: Date,
    required: true,
    default: Date.now
  },
  notes: [{
    type: Schema.Types.ObjectId,
    ref: "Note"
  }]
  // note: {
  //   type: Schema.Types.ObjectId,
  //   ref: "Note"
  // }
});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;
