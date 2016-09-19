"use strict";
var express = require('express');
var app = express();
var fs = require("fs");

const port=process.env.PORT;
const host=process.env.IP;

let lugares={};
let lugaresJSON="";
fs.readFile( __dirname + "/" + "Lugares.json", 'utf8', function (err, data) {
  if (!err){
    lugaresJSON=data;
    lugares=JSON.parse(data);    
  }
});

app.get('/', function (req, res) {
  res.json(lugares);
})

app.get('/distritos', function (req, res) {
  res.json(lugares.reduce(function(previousValue,currentValue){
    if (previousValue.indexof(currentValue.distrito))
      previousValue.push(currentValue.distrito);
    return previousValue;
  },[]));
});

app.get('/concelhos/:distrito', function (req, res) {
  res.json(lugares.reduce(function(previousValue,currentValue){
    if (currentValue.distrito==req.params.distrito && 
        !previousValue.includes(currentValue.concelho))
      previousValue.push(currentValue.concelho);
    return previousValue;
  },[]));
});

app.get('/freguesias/:distrito/:concelho', function (req, res) {
  res.json(lugares.reduce(function(previousValue,currentValue){
    if (currentValue.distrito==req.params.distrito && 
        currentValue.concelho==req.params.concelho &&
        !previousValue.includes(currentValue.freguesia))
      previousValue.push(currentValue.freguesia);
    return previousValue;
  },[]));
});

app.get('/lugares/:distrito/:concelho/:freguesia', function (req, res) {
  res.json(lugares.reduce(function(previousValue,currentValue){
    if (currentValue.distrito==req.params.distrito && 
        currentValue.concelho==req.params.concelho &&
        currentValue.freguesia==req.params.freguesia &&
        !previousValue.includes(currentValue.lugar))
      previousValue.push(currentValue.lugar);
    return previousValue;
  },[]));
});

var server = app.listen(port, host, function () {

   var host = server.address().address
   var port = server.address().port

   console.log("Example app listening at http://%s:%s", host, port)

})
