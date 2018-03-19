const db = require("../models");
const scrape = require("../scripts/scrape.js");

module.exports = function(app) {

  app.get("/api/scrape", function(req, res){

    scrape()
    .then(function(data){
      if( data && data.length ){
        db.Article.collection.insertMany( 
          data,
          { ordered: false },
          function(err, articles){
            if (err) {
              res.json({
                scraped : data.length,
                stored  : err.result.nInserted
              });
            } 
            else {
              res.json({
                scraped : data.length,
                stored  : articles.insertedCount 
              });
            }  
        });
      }
      else{
        res.json({ scraped:0, stored: 0});        
      }
    })
    .catch(error => res.send(error));

  });
   
  //all articles
  app.get("/api/jobs", function(req, res) {
    db.Article.find({})
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
  });

  //single article with notes
  app.get("/api/job-notes/:id", function(req, res) {
    db.Article.findOne({ _id: req.params.id })
      .populate("notes")
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
  });

  //delete article
  app.delete("/api/jobs/:id", function(req, res) {

    db.Article.findOneAndRemove({'_id': req.params.id}, function(err, art){
      if(err) res.json(err);
      for(var i=0; i<art.notes.length; i++){
        db.Note.remove({_id: art.notes[i]}).exec();
      }
      // art.remove();
      res.json(art);
    });
  });

  //save a note associated with article (id)
  app.post("/api/job-notes/:id", function(req, res) {

    db.Note.create(req.body)
      .then(function(dbNote) {
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: {notes: dbNote._id} }, { new: true });
      })
      .then(function(result) {
        res.json(result);
      })
      .catch(function(err) {
        res.json(err);
      });
  });

  //delete note
  app.delete("/api/note/:n_id", function(req, res) {
    var art_id = req.body.a_id;
    var note_id = req.params.n_id;
    db.Note.remove({_id: note_id})
      .then(function(dbNote) {
        return db.Article.findOneAndUpdate( {_id: art_id}, { $pull: {notes: note_id} } );      
      })
      .then(function(result){
        res.json(result);
      })
      .catch(function(err) {
        res.json(err);
      });
  });

};