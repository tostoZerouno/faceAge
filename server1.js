//var dispatcher = require('httpdispatcher'); 
//var HttpDispatcher = require('httpdispatcher');
//var dispatcher = new HttpDispatcher();
var bind = require('bind');
var faceService = require("./face-service.js");
var needle = require("needle");
var atob = require("atob");
var http = require('http');
var express = require('express');
var bodyParser = require("body-parser");
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })
var multiparty = require("multiparty");

//var fs = require()

var app = express();
app.set('port', 4430);
//app.use(bodyParser.raw());
//app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var router = express.Router();
app.use('/',router);
/*app.use(function (req, res, next) {
  console.log(req.files); // JSON Object
  next();
});*/

router.get('/home', function (req, res, chain) {
    bind.toFile('tpl/home.tpl', {
        name: 'Alberto',
        address: 'via Roma',
        city: 'Milano'
    }, function (data) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
    });
});
router.get('/photo', function (req, res, chain) {
    bind.toFile('tpl/photo.tpl', {
        age: '1000',
        file: './photo.js',
        //file2: './face-service.js'
        //city: 'Milano'
    }, function (data) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
    });
});

router.post('/age',upload.any(), function (req, res) {
    var form = new multiparty.Form();
    
    form.parse(req, function(err, fields, files){
        console.log(fields);
    });
    var sizeof = require('object-sizeof');
    console.log(sizeof(req.body));
    console.log(req.body.file);
    console.log(req.file);
    console.log("POST");
    res.writeHead(200, { 'Content-Type': 'application/json' });
    var getage = 0;

    faceService.getAgeFromImage(blobbizza(req.body))
        .then(age => {
            getage = age;
            var response = JSON.stringify({
                body: {
                    age: getage
                }
            });

            res.end(response);
        })
        .catch(error => {
            console.log('Oops! Something went wrong. Try again later.');
            console.error(error);
        });

});

var server  = http.createServer(app);
server.listen(app.get('port'), function(err) {
        console.log(err, server.address());
});

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