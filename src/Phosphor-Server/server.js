var express = require('express');
var path = require('path');
var port = process.env.PORT || 3000;
var app = express();

var shell = require('node-powershell');

var bodyParser = require('body-parser');

var app = express();

app.use("/", express.static(__dirname + '/../Phosphor-App'));

app.set('port', (process.env.PORT || 5000));
app.set('views', __dirname + "/../Phosphor-App");
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

var PS = new shell("./test.ps1");

console.log(__dirname);

var verbs = [];
var nouns = [];
var modules = [];

PS.on('output', function(data){
    //console.log(data);
    var splitted = data.split("-");

    var firstSplit = (splitted[0] + "").split(/[\s,]+/).join().split(",");

    if (firstSplit[0] === "Cmdlet") {
      var verb = firstSplit[firstSplit.length - 1];

      var secondSplit = (splitted[1] + "").split(/[\s,]+/).join().split(",");
      var noun =  secondSplit[0];
      var module = secondSplit[secondSplit.length - 2];

/*
      console.log("Verb: " + verb);
      console.log("Noun: " + noun);
      console.log("Module: " + module);
*/

      if (!nouns[noun]) {
        nouns[noun] = noun;
        nouns.push(noun + "-" + module);
      }


      if (!modules["" + module]) {
        modules["" + module] = [];
        modules["" + module].push(noun);
      }
      else {
          modules["" + module].push(noun);
      }

      var unique = true;

      for (var i = 0; i < modules.length; i++) {
        if (modules[i] === module) {
          unique = false;
        }
      }

      if (unique) {
        modules.push(module);
      }

      if (!verbs["" + noun]) {
        verbs["" + noun] = [];
      }

      verbs["" + noun].push(verb);
      //console.log("Noun: " + noun + " | Verb: " + verbs[noun]);
    }

    //console.log(data);

/*
    console.log(modules[module]);
    console.log("List of modules: " + modules);
    console.log("BREAK");
    */

});
PS.on('end', function(code) {
    //optional callback
    //Do Something
});

//app.use('/app', express.static(path.resolve(__dirname, 'app')));
//app.use('/libs', express.static(path.resolve(__dirname, 'libs')));

var renderIndex = (req, res) => {
    //res.sendFile(path.resolve(__dirname, 'index.html'));
    res.render('index.ejs', {nouns: nouns, modules: modules});
}

app.get('/', renderIndex);

app.get('/nounitems', (req, res) => {

  var query = req.query;
  var noun = query.noun;

  console.log("Request for Noun Items for noun: " + noun);

  var result = [];

  function psgo() {
    PS = new shell("Get-" + noun);

    PS.on('output', function(data){
        console.log(data);
        result.push(data);
    });
  }

  psgo();

  setTimeout((function() {
      res.send(result);
    }
  ), 3000);

});

app.get('/verbs', (req, res) => {
  var query = req.query;
  var noun = query.noun;

  console.log("Request for verbs for noun: " + noun);

  //res.send(verbs["" + noun]);

  setTimeout((function() {
      res.send(verbs["" + noun]);
    }
  ), 400);
});

app.get('/command-details', (req, res) => {
  var query = req.query;
  var command = query.command;

  var result = "";

  console.log("Request for command details: " + command);

  PS = new shell("Get-Command " + command + " -Syntax");

  PS.on('output', function(data) {
    console.log(data);

    for (var i = 0; i < data.length; i++) {
      result += data.charAt(i);
    }

  });

  setTimeout((function() {
      res.send(result);
    }
  ), 2000);

});

var server = app.listen(port, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('This express app is listening on port:' + port);
});
