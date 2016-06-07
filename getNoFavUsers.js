'use strict'

const MongoClient = require('mongodb').MongoClient;

MongoClient.connect("mongodb://localhost:27017/music", function(err, db) {
  console.log("connected");
  console.log("---> Empty favoriteSongs list users:");

  var Users = db.collection('users');
  Users.find({favoriteSongs: {$size: 0}}).toArray()
  .catch(err => { console.log('find error' + err); })
  .then(function(users){
    users.forEach(function(user){
      console.log(user.username);
    })
    return users.length;
  })
  .catch(err => console.log('printing error ' + err))
  .then(function(length){
    console.log("_number of users without favorite songs: " + length);
    db.close();
  });
});
