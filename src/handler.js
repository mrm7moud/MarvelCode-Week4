var fs = require('fs');
var path = require ('path');
var functions = require('./functions.js');
var qs = require('querystring');


var extensionType = {
  "html": "text/html",
  "css": "text/css",
  "js": "application/javascript",
  "ico": "image/x-icon",
  "woff": "application/x-font-woff",
  "svg": "image/svg+xml",
  "woff2": "application/x-font-woff2"
}

 function handleHome(req, res){
   fs.readFile(__dirname + '/../public/index.html', function(err, data) {
     if (err) {
       res.writeHead(500, {'Content-Type': 'text/html'});
       res.end('<h1> Internal server error</h1>');
     } else {
       res.writeHead(200, {'Content-Type': 'text/html'});
       res.end(data);
     }
 });
};

function handlePublic(req, res) {
  var endpoint = req.url;
  fs.readFile(path.join(__dirname, '..', 'public', endpoint), function(err, file) {
    if (err) {
      console.log(err);
      notFound(req,res);
    } else {
      var extension = endpoint.split('.')[1];
      res.writeHead(200, { "Content-Type": extensionType[extension]});
      res.end(file);
    }
  })
}

function handleSearch(req,res){
  var endpoint = req.url;
  var string = endpoint.split('?')[1];
  var query = qs.parse(string);
  console.log(query);
    res.writeHead(200, { "Content-Type": "application/javascript"});
    var suggestions = "";
    if(query.gender==='both' && query.align==='both'){
      suggestions = functions.getTenNames(query.text);
    }
    else suggestions = functions.filterBySexAndAlign(query.text,query.align,query.gender);

    res.end(suggestions.toString());
    }



 function notFound(req, res){
  res.writeHead(404,{'Content-Type': 'text/html'});
  res.write('<h1>404 Page Requested Cannot Be Found<h1>');
  res.end();
};

module.exports = {
handleHome : handleHome,
handlePublic : handlePublic,
handleSearch: handleSearch,
notFound : notFound,
};
