var express = require('express');
var app = express();
var fs = require("fs");

app.get('/listUsers', function (req, res) {
  // fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
  //     console.log( data );
  //     res.end( data );
  // });
  res.end("Worked");
})

var server = app.listen(process.env.PORT, process.env.IP, function () {

   var host = server.address().address
   var port = server.address().port

   console.log("Example app listening at http://%s:%s", host, port)

})