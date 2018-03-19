var express 		= require("express");
var bodyParser 		= require("body-parser");
var exphbs 			= require("express-handlebars");
var logger 			= require("morgan");
var mongoose 		= require("mongoose");
var db 				= require("./models");

var express = require("express");
var bodyParser = require("body-parser");

var PORT = process.env.PORT || 3000;

var app = express();

app.use(express.static("public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(logger("dev"));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

require("./routes/api.js")(app);
require("./routes/view.js")(app);

// app.use("./controllers/fetch.js");

mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/mongoHeadlines").then(function(){
	app.listen(PORT, function(){
		console.log("Listening on port %s", PORT);
	});	
});

