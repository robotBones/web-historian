var _ = require('underscore');
// eventually, you'll have some code here that uses the code in `archive-helpers.js`
// to actually download the urls you want to download.

// this might be wrong
var archive = require('../helpers/archive-helpers.js');

// read list of urls
exports.fetch = function() {
  archive.readListOfUrls(function(list){
    if(list){
      _.each(list, function(website){
        if(website !== ""){
          archive.downloadSite(website);
        }
      });
    }
  });
}

exports.fetch();
