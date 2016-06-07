'use strict'

const MongoClient = require('mongodb').MongoClient;

MongoClient.connect("mongodb://localhost:27017/music", function(err, db) {
  console.log("connected");
  console.log("---> Coldplay fans:");

  var Users = db.collection('users');
  Users.find({favoriteSongs: { $elemMatch: {artist: "Coldplay"}}}).toArray()
  .catch(err => { console.log('find error' + err); })
  .then(function(users){
    users.forEach(function(user){
      console.log(user.username);
    })
    return users.length;
  })
  .then(function(length){
    console.log("_number of Coldplay fans: " + length);
    db.close();
  });
});
