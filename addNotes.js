'use strict'

const MongoClient = require('mongodb').MongoClient;
const Q = require('q');

var random = function(high, low){
  return Math.floor(Math.random() * (high - low + 1) + low);
}

MongoClient.connect("mongodb://localhost:27017/music", function(err, db) {
  console.log("connected");
  var Users = db.collection('users');
  var Songs = db.collection('songs');
  var songs = [];

  //Création de la collection
  db.createCollection('notes');
  var Notes = db.collection('notes');

  //Je récupère toutes les chansons
  Songs.find({}, {title:1, artist:1}).toArray()
  .catch(err => { console.log('find songs error: ' + err); })
  //Je les stock
  .then((songsArray) => songs = songsArray)
  .then(() => Notes.remove({}))
  .catch(err => { console.long('remove error ' + err)})
  .then(function(){
    //Je récupère tout les users
    let promises = [];
    let query = {};
    var cursor = Users.find(query);

    //Je parcours les users
    cursor.each(function(err, user){
      if(user){
        let notesNb = random(0,5);
        let tmpSongs = songs.slice(0);

        //Je génère les notes pour chaque user
        for(let i=0; i<notesNb; i++){
          let index = random(0, tmpSongs.length);
          var insert = { username: user.username, song: tmpSongs[index], note: random(1,5)};
          tmpSongs.splice(index, 1);
          //Je stock chaque promesse d'insertion
          var promise =
            Q.npost(Notes, 'insertOne', [insert])
            .then(function(inserted){
              //console.log('Inserted: ' + inserted);
            });
          promises.push(promise);
        }
      }
      else {
        //J'execute toute mes promesses d'insertion
        Q.all(promises)
        .then(function() {
          if (cursor.isClosed()) {
            console.log('users notes inserted');
            db.close(); //Je referme la DB quand elles sont terminées
          }
        })
        .fail(console.error);
      }
    });
  });
});
