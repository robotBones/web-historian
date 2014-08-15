var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelp = require('./http-helpers.js');
var qs = require('querystring');
var urlParse = require('url');
var worker = require("../workers/htmlfetcher.js");
// require more modules/folders here!

var headers = httpHelp.headers;

exports.handleRequest = function (req, res) {

  var redirect = function(filename){
    var staticLoading = path.join(__dirname, filename);
    httpHelp.serveAssets(res, staticLoading, function(data){
      headers['Location'] = "http://127.0.0.1:8080/loading";
      res.writeHead(302, headers);
      // res.setHeader('Location', "http://127.0.0.1/loading");
      res.write(data);
      console.log("redirecting");
      res.end();
    });
  };


  var handleGet = function(pathname){
    var page;
    if(pathname === "/"){
      page = path.join(__dirname, './public/index.html');
    } else if(pathname === "/loading"){
      page = path.join(__dirname, './public/loading.html');
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
      var archivedSite = path.join(archive.paths['archivedSites'], website);
      // get list of sites from sites.txt
      archive.readListOfUrls(function(list){
        // check if if website is in that list
        var isUrlInList = archive.isUrlInList(list, website);
        if (isUrlInList) {
          // check if url in list has been archived
          archive.isURLArchived(website, function(exists){
            // if archived then serve assests
            if (exists) {
            // if archived then serve site
              httpHelp.serveAssets(res, archivedSite, function(data){
                res.writeHead(200, headers);
                res.write(data);
                res.end();
              });
              // if in list but not archived then redirect to loading page
            } else {
              console.log('WTF',"and stuff: ", website, exists, archivedSite);
              // remove this when cron is implememneted
              // worker.fetch();
              redirect('./public/loading.html');
            }
          });
        } else { // if url is not in url list
          console.log('inside else statement');
          archive.addUrlToList(website);
          // after url is added then go to loading page and wait for cron to fetch archive
          redirect('./public/loading.html');
        }
      });
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

};

