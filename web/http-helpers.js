var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};

exports.serveAssets = function(res, asset, callback) {
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...), css, or anything that doesn't change often.)
  console.log('asset',asset);
  fs.readFile(asset, function(err, data){
    if (err) {
      res.writeHead(404, headers);
      res.end("Sorry, page not found.");
    } else {
      // console.log(data);
      callback(data);
    }
  });
};
///////////////////////////////////////////////
// fs.readFile(archive.paths.siteAssets + asset, function(err, contents) {
//   if (!err && contents) {
//     sendResponse(res, contents);
//     return;
//   }

// fs.readFile(archive,paths.archivedSites + asset, function(err, contents) {
//   if (!err && contents) {
//     sendResponse(res, contents);
//     return;
//   }

//   if(cb) {
//     cb();
//     return;
//   }

//   send404(res);

//   });
// });
// };

// As you progress, keep thinking about what helper functions you can put here!
