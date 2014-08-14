var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelp = require('./http-helpers.js');
var qs = require('querystring');
// require more modules/folders here!

var headers = httpHelp.headers;

exports.handleRequest = function (req, res) {
  console.log('in handleRequest()');
  console.log('request url is: ', req.url);

  var getSite = function(){
    console.log('in getSite()');
    var staticIndex = path.join(__dirname, './public/index.html');
    console.log(staticIndex);
    httpHelp.serveAssets(res, staticIndex, function(data){
      console.log('inside of callback');
      res.writeHead(200, headers);
      console.log('reached end of getSite()');
      res.write(data);
      res.end();
    });
  };

var redirect = function(filename){
  var staticLoading = path.join(__dirname, filename);
  httpHelp.serveAssets(res, staticLoading, function(data){
    res.writeHead(200, headers);
    res.write(data);
    console.log("redirecting");
    res.end();
  });
};

  var makeArchive = function(){
    var body = '';
    req.on('data', function(data) {
      body += data;
    });
    req.on('end', function(){
      var post = qs.parse(body);
      console.log('post: ', post.url);
      // work on this
      archive.readListOfUrls(post.url);
      archive.redirect(post.url);
    });
  };

  var optionsResponse = function(){
    console.log('in optionsResponse');
    console.log('headers: ', headers);
    res.writeHead(200, headers);
  };

  var verbMap = {
    "GET": getSite,
    "POST": makeArchive,
    "OPTIONS": optionsResponse
  }

  var action = verbMap[req.method];
  // if verb has a map
  if(typeof action === 'function'){
    console.log('request method recognized: ', req.method);
    action(res);
  }
  // make sure res is end();
  // res.end(archive.paths.list);
};

