/* eslint-disable no-plusplus,no-param-reassign */
const http = require('http');
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const WebSocketServer = require('ws').Server;

const app = express();

const server = http.createServer(app);

const port = process.env.PORT || 8080;
const host = process.env.IP || '0.0.0.0';

let places = {};
fs.readFile(`${__dirname}/Lugares.json`, 'utf8', (err, data) => {
  if (!err) {
    places = JSON.parse(data);
  }
});

app.use(cors());

// Serve our app
app.use('/client', express.static('client/build'));
app.use('/static', express.static('client/build/static'));

app.get('/', (req, res) => {
  res.json(places);
});

app.get('/districts', (req, res) => {
  res.json(places.reduce((previousValue, currentValue) => {
    if (previousValue.indexOf(currentValue.district) === -1)
      previousValue.push(currentValue.district);
    return previousValue;
  }, []));
});

app.get('/countys/:district', (req, res) => {
  res.json(places.reduce((previousValue, currentValue) => {
    if (currentValue.district === req.params.district &&
        previousValue.indexOf(currentValue.county) === -1)
      previousValue.push(currentValue.county);
    return previousValue;
  }, []));
});

app.get('/parishs/:district/:county', (req, res) => {
  res.json(places.reduce((previousValue, currentValue) => {
    if (currentValue.district === req.params.district &&
        currentValue.county === req.params.county &&
        previousValue.indexOf(currentValue.parish) === -1)
      previousValue.push(currentValue.parish);
    return previousValue;
  }, []));
});

app.get('/places/:district/:county/:parish', (req, res) => {
  res.json(places.reduce((previousValue, currentValue) => {
    if (currentValue.district === req.params.district &&
        currentValue.county === req.params.county &&
        currentValue.parish === req.params.parish &&
        previousValue.indexOf(currentValue.place) === -1)
      previousValue.push(currentValue.place);
    return previousValue;
  }, []));
});

app.get('/procura/:place', (req, res) => {
  const results = [];
  let found = 0;
  places.some((value) => {
    if (value.place.toLowerCase().indexOf(req.params.place.toLowerCase()) !== -1) {
      results.push(value);
      found += 1;
    }
    return found >= 10;
  });

  res.json(results);
});


const searchBy = (query, by, limit) => {
  const results = [];
  let i = 0;
  let count = 0;
  const found = [];
  while (++i < places.length && found.length < limit) {
    const value = places[i];
    if (value[by].toLowerCase().indexOf(query.toLowerCase()) !== -1 && !found.includes(value[by])) {
      results.push(value);
      found.push(value[by]);
      count++;
    }
  }
  return results;
};

app.get('/search', (req, res) => {
  const limit = Number(req.query.limit) || 10;
  ['district', 'county', 'parish']
        .forEach(by => req.query[by] && res.json(searchBy(req.query[by], by, limit)));
    // res.json([]);
});
const searchSimpleBy = (query, by, limit) => {
  let i = 0;
  let count = 0;
  const found = [];
  while (++i < places.length && found.length < limit) {
    const value = places[i];
    if (value[by].toLowerCase().indexOf(query.toLowerCase()) !== -1 && !found.includes(value[by])) {
      found.push(value[by]);
      count++;
    }
  }
  return found;
};

app.get('/search/simple', (req, res) => {
  const limit = Number(req.query.limit) || 10;
  ['district', 'county', 'parish']
        .forEach(by => req.query[by] && res.json(searchSimpleBy(req.query[by], by, limit)));
    // res.json([]);
});

const wss = new WebSocketServer({ server, path: '/ws' });

wss.on('connection', (ws) => {
  console.log('ws connected');
  ws.onmessage = ({ data }) => {
    const message = JSON.parse(data);
    switch (message.type) {
      case 'search':
        ws.send(JSON.stringify({
          type: 'search',
          data: searchBy(message.data.query, message.data.by, message.data.limit),
        }));
    }
    console.log('ws message', message.type);
  };
  ws.send(JSON.stringify({ message: 'The server says this' }));
});

server.listen(port, host, () => {
  console.log('Example app listening at http://%s:%s', server.address().address, server.address().port);
});
