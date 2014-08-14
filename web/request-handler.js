var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelp = require('./http-helpers.js');
var qs = require('querystring');
var urlParse = require('url')
// require more modules/folders here!

var headers = httpHelp.headers;

exports.handleRequest = function (req, res) {

  var redirect = function(filename){
    var staticLoading = path.join(__dirname, filename);
    httpHelp.serveAssets(res, staticLoading, function(data){
      res.writeHead(302, headers);
      res.write(data);
      console.log("redirecting");
      res.end();
    });
  };


  var handleGet = function(pathname){
    var page;
    if(pathname === "/"){
      page = path.join(__dirname, './public/index.html');
    } else {
      page = path.join(archive.paths['archivedSites'], pathname);
    }

    httpHelp.serveAssets(res, page, function(data){
      res.writeHead(200, headers);
      res.write(data);
      res.end();
    });
  };

  var checkArchives = function(){
    var body = '';
    req.on('data', function(data) {
      body += data;
    });
    req.on('end', function(){
      var post = qs.parse(body);
      var website = post.url;
      var urlList = archive.readListOfUrls(function(list){
        return list;
      });
      var isUrlInList = archive.isUrlInList(urlList, website);
      if (isUrlInList) {
        var isArchived = archive.isURLArchived(website);
        if (isArchived) {
        // if archived then serve site.html
          var archivedSite = path.join(archive.paths['archivedSites'], website);
          httpHelp.serveAssets(res, archivedSite, function(data){
            res.writeHead(200, headers);
            res.write(data);
            res.end();
          });
        } else { // if url in list is not yet archived
          console.log('WTF');
        }
      } else { // if url is not in url list
        archive.addUrlToList(website);
        // after url is added then go to loading page and wait for cron to fetch archive
        redirect('./public/loading.html')
      }
    });
  };

  var optionsResponse = function(){
    console.log('in optionsResponse');
    console.log('headers: ', headers);
    res.writeHead(200, headers);
    res.end();
  };

  var parsedUrl = urlParse.parse(req.url).pathname;
  if(req.method === 'GET'){
    handleGet(parsedUrl);
  } else if (req.method === 'POST') {
    checkArchives(); //note - no longer need to parse URL inside checkArchives
  } else if (req.method === 'OPTIONS') {
    optionsResponse();
  }

  // var verbMap = {
  //   "GET": handleGet,
  //   "POST": checkArchives,
  //   "OPTIONS": optionsResponse
  // }

  // var action = verbMap[req.method];
  // // if verb has a map
  // if(typeof action === 'function'){
  //   console.log('request method recognized: ', req.method);
  //   action(res);
  // }
  // make sure res is end();
  // res.end(archive.paths.list);
};

