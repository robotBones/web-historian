var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var lazy = require('lazy');
var httpHelp = require('../web/http-helpers.js');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  'siteAssets' : path.join(__dirname, '../web/public'),
  'archivedSites' : path.join(__dirname, '../archives/sites'),
  'list' : path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for jasmine tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};


// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

var sitesFile = path.join(__dirname, '../archives/sites.txt');

exports.readListOfUrls = function(callback){
// read every line of file
  var websiteList;
  var myFileAsText;
  fs.readFile(sitesFile, function readFileCB(error, data){
    if(data){
      myFileAsText = data.toString();
      websiteList = myFileAsText.split("\n");
    }
    callback(websiteList); // array
  });

};

exports.isUrlInList = function(list, website){
  return _(list).contains(website);
};

exports.addUrlToList = function(website){
  // add novel POSTed website
  fs.appendFile(sitesFile, '\n'+ website + '\n');
};

// this needs to be rewritten. we dont have a response objectg
// exports.redirect = function(filename){
//   console.log("dirname:",__dirname, "filename: ", filename);
//   var staticLoading = path.join(__dirname, filename);
//   fs.readFile(staticLoading, function(err, data){
//     if (err) throw err;
//     res.writeHead(200, headers);
//     res.write(data);
//     console.log("redirecting from isURLArchived");
//     res.end();
//   });
// };

exports.fetchArchive = function(website) {
  var archivedSite = path.join(exports.path['archivedSites'], website);
  fs.readFile(archivedSite, function(err, data){
    if(err) throw err;
    res.writeHead(200, headers);
    res.write(data);
    res
  });
}
exports.isURLArchived = function(website){
  var archived = path.join(exports.path['archivedSites'],website); // this returns a path as a string
  fs.exists(archived, function isURLArchivedCB(exists){
    return (exists)
  });
};

// assuming this is the function to archive websites on the list of urls.
exports.downloadUrls = function(){
};
