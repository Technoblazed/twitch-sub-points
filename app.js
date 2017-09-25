const _ = require('lodash');
const path = require('path');
const config = require(path.join(__dirname, 'config'));
const logger = require('morgan');
const request = require('requestretry');
const express = require('express');
const app = express();
const response = express();

let points = 0;
let subs = 0;
let subCache = {};

response.get('/', function(req, res) {
  res.json(subCache);
});

app.use(logger('dev'));
app.use('/', response);

function getData(offset = 0) {
  request({
    url: `https://api.twitch.tv/kraken/channels/${config.twitch.channel_id}/subscriptions?direction=ASC&limit=100&offset=${offset}`,
    headers: {
      'Accept': 'application/vnd.twitchtv.v5+json',
      'Authorization': `OAuth ${config.twitch.oauth}`,
      'Client-ID': config.twitch.client_id
    },
    json: true,
    fullResponse: false
  }, function(error, response, body) {
    if (!error) {
      _.forEach(body.subscriptions, function(o) {
        subs++;
        switch (o.sub_plan) {
          case 'Prime': {
            points++;
            break;
          }
          case '1000': {
            points++;
            break;
          }
          case '2000': {
            points = points + 2;
            break;
          }
          case '3000': {
            points = points + 6;
            break;
          }
        }
      });

      if (body.subscriptions.length < 100) {
        subCache = {
          'points': points - config.offsets.points,
          'subs': subs - config.offsets.subs,
          'updatedAt': new Date()
        };
        points = 0;
        subs = 0;
        offset = 0;
      } else {
        offset = offset + 100;
        getData(offset);
      }
    }
  });
}

function startGet() {
  getData();
}

startGet();
setInterval(startGet, 60 * 1000);

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
