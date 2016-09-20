"use strict";
var express = require('express');
var app = express();
var cors = require('cors');
var fs = require("fs");

const port=process.env.PORT || 8080;
const host=process.env.IP || "0.0.0.0";

let lugares={};
let lugaresJSON="";
fs.readFile( __dirname + "/" + "Lugares.json", 'utf8', function (err, data) {
  if (!err){
    lugaresJSON=data;
    lugares=JSON.parse(data);    
  }
});

app.use(cors());

app.get('/', function (req, res) {
  res.json(lugares);
})

app.get('/distritos', function (req, res) {
  res.json(lugares.reduce(function(previousValue,currentValue){
    if (previousValue.indexOf(currentValue.distrito)==-1)
      previousValue.push(currentValue.distrito);
    return previousValue;
  },[]));
});

app.get('/concelhos/:distrito', function (req, res) {
  res.json(lugares.reduce(function(previousValue,currentValue){
    if (currentValue.distrito==req.params.distrito && 
        previousValue.indexOf(currentValue.concelho)==-1)
      previousValue.push(currentValue.concelho);
    return previousValue;
  },[]));
});

app.get('/freguesias/:distrito/:concelho', function (req, res) {
  res.json(lugares.reduce(function(previousValue,currentValue){
    if (currentValue.distrito==req.params.distrito && 
        currentValue.concelho==req.params.concelho &&
        previousValue.indexOf(currentValue.freguesia)==-1)
      previousValue.push(currentValue.freguesia);
    return previousValue;
  },[]));
});

app.get('/lugares/:distrito/:concelho/:freguesia', function (req, res) {
  res.json(lugares.reduce(function(previousValue,currentValue){
    if (currentValue.distrito==req.params.distrito && 
        currentValue.concelho==req.params.concelho &&
        currentValue.freguesia==req.params.freguesia &&
        previousValue.indexOf(currentValue.lugar)==-1)
      previousValue.push(currentValue.lugar);
    return previousValue;
  },[]));
});

app.get('/procura/:lugar', function (req, res) {
  res.json(lugares.reduce(function(previousValue,currentValue){
    if (currentValue.lugar.toLowerCase().indexOf(req.params.lugar.toLowerCase())!=-1)
      previousValue.push(currentValue);
    return previousValue;
  },[]));
});


var server = app.listen(port, host, function () {

   var host = server.address().address
   var port = server.address().port

   console.log("Example app listening at http://%s:%s", host, port)

})
