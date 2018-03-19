const db = require("../models");

module.exports = function(app) {

  app.get("/jobs", function(req, res) {
    db.Article.find({}, null, {sort: { posted_date: -1 }})
      .then(function(savedJobs) {
        // console.log(savedJobs);
        res.render('saved', { jobs: savedJobs });
      })
      .catch(function(err) {
        res.render('saved',{ error: err });
      });
  });

  app.get("/jobs/:id", function(req, res) {
    db.Article.findOne({ _id: req.params.id })
      .populate("notes")
      .then(function(dbArticle) {
        res.render('job', dbArticle);
      })
      .catch(function(err) {
        res.render('job', err);
      });
  });

  app.get("*", function(req, res) {
    res.redirect('/jobs');
  });

};
