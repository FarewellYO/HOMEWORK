var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');
var queryString = require('querystring');
var util = require('util');

var mine = require('./mine').types;
var PORT =3000;
var DIR = 'test1';

var server = http.createServer(function (request, response) {
    var pathname = url.parse(request.url).pathname;
    var realPath = path.join(DIR, pathname);

    console.log("这是我请求的: " + pathname);
    console.log("要找本地文件: " + realPath);

    if (pathname === "/jQuery ajax2/") {
        if (request.method === "GET") {
            var params = url.parse(request.url, true).query;
            response.write("fname：" + params.fname);
            response.write("\n");

       response.write("lname：" + params.lname);

            response.write("\n");
            response.write("came from node server");
            response.write("\n");
            response.end("bye");
            return;
        } else if (request.method === "POST") {
            var postBody = '';

            request.on('data', function (chunk) {
                postBody += chunk;
            });

            request.on('end', function () {
                console.log("我收到了:" + postBody);
                postBody = queryString.parse(postBody);
                response.end(util.inspect(postBody));
            });
            return;
        }

    }
}

var ext = path.extname(realPath);
ext = ext ? ext.slice(1) : 'unknown';
fs.exists(realPath, function (exists) {
    if (!exists) {
        response.writeHead(404, {
            'Content-Type': 'text/plain'
        });

        response.write("This request URL " + pathname + " was not found on this server.");
        response.end();
    } else {
        console.log(realPath);

        fs.readFile(realPath, "binary", function (err, file) {
            if (err) {
                response.writeHead(500, {
                    'Content-Type': 'text/plain'
                });
                response.end(err);
            } else {
                var contentType = mine[ext] || "text/plain";
                response.writeHead(200, {
                    'Content-Type': contentType
                });
                response.write(file, "binary");
                response.end();
            }
        });
    }
});
});
server.listen(PORT);
console.log("Server runing at port: " + PORT + ".");
console.log('Server running at http://%s:%s | but here no default index.html optimize. \nYou could exercise fix this "bug".', "127.0.0.1", PORT);
console.log('Server running at http://%s:%s/web1_form_action.html | form commit GET,POST Method.', "127.0.0.1", PORT);
console.log('Server running at http://%s:%s/web2_js_ajax.html | ajax commit Get,POST Method.', "127.0.0.1", PORT);


