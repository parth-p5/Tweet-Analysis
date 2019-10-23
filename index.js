var Twit = require('twit');
const express = require('express');
const app = express();
const server = require('http').Server(app);
var io = require('socket.io')(server);
var fs = require('fs');
var config = require('./config');

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

app.get('/tweet', function(req, res){
  T.get('search/tweets', { q: req.query.source, count: 100 }, function(err, data, response) {
    const tweet = data.statuses[0];
    var tweetbody = {
      'text': tweet.text,
      'userScreenName': "@" + tweet.user.screen_name,
      'userImage': tweet.user.profile_image_url_https,
      'userDescription': tweet.user.description,
    }
    try {
      if(tweet.entities.media[0].media_url_https) {
        tweetbody['image'] = tweet.entities.media[0].media_url_https;
      }
    } catch(err) { }
    io.emit('allTweet',tweetbody)
  })
  res.send("Success");
});

var T = new Twit(config.twitter);

// listen for requests :)
const listener = server.listen(8080, function() {
  console.log('Your app is listening on port ' + 8080);
});
