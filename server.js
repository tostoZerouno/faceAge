//var dispatcher = require('httpdispatcher'); 
//var HttpDispatcher = require('httpdispatcher');
//var dispatcher = new HttpDispatcher();
var bind = require('bind');
var faceService = require("./face-service.js");
//var needle = require("needle");
var atob = require("atob");
//var http = require('http');
var restify = require("restify");

//var fs = require()
var server = restify.createServer({ accept: ["image/png"] });
server.use(restify.bodyParser());
server.listen(process.env.port || process.env.PORT || 443, function () {
    console.log('%s listening to %s', server.name, server.url);
});


server.get('/home', function (req, res, chain) {
    bind.toFile('tpl/home.tpl', {
        name: 'Alberto',
        address: 'via Roma',
        city: 'Milano'
    }, function (data) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
    });
});

server.get('/photo', function (req, res, chain) {
    bind.toFile('tpl/photo.tpl', {
        age: '1000',
        file: './photo.js',
        //file2: './face-service.js'
        //city: 'Milano'
    }, function (data) {
        res.writeHead(200, {
            'Content-Type': 'text/html',
            'Access-Control-Allow-Origin': '*'
        });
        res.end(data);
    });
});

server.post('/age', function (req, res) {
    console.log("POST");
    res.writeHead(200, { 'Content-Type': 'application/json' });
    var getage = 0;

    faceService.getAgeFromImage(req.body)
        .then(age => {
            getage = age;
            var response = JSON.stringify({
                body: {
                    age: getage
                }
            });

            console.log(getage);
            res.end(response);
        })
        .catch(error => {
            console.log('Oops! Something went wrong. Try again later.');
            console.error(error);
        });

});

/*http.createServer(function (req, res) {
    dispatcher.dispatch(req, res);
}).listen(443,"faceage.herokuapp.com");*/

function blobbizza(dataURI) {
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return ia;
}