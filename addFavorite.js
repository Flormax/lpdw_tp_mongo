'use strict'

const MongoClient = require('mongodb').MongoClient;
const Q = require('q');

var random = function(high){
  return Math.floor(Math.random() * high);
}

MongoClient.connect("mongodb://localhost:27017/music", function(err, db) {
  console.log("connected");
  var Users = db.collection('users');
  var Songs = db.collection('songs');
  var songs = [];

  //Je récupère toutes les chansons
  Songs.find({}, {title:1, artist:1}).toArray()
  .catch(err => { console.log('find songs error: ' + err); })
  //Je les stock
  .then((songsArray) => songs = songsArray)
  .then(function(){
  //Et j'ajoute une liste de fav à chaque user

    //Update des users
    let promises = [];
    let query = {};
    var cursor = Users.find(query);

    //Je parcours les users
    cursor.each(function(err, doc) {
      if (err) throw err;
      if (doc) {
        //Je génère une liste de fav aléatoire
        let tmpSongs = songs.slice(0); //Copie de la liste de chansons
        let index = random(tmpSongs.length+1); //Choix de la prochaine chanson fav
        let favNb = random(11); //Taille de la liste de fav
        let fav = []; //Liste de fav
        for(let i=0; i<favNb; i++){
          fav[i] = tmpSongs[index];
          tmpSongs.splice(i, 1); //Je retire le chanson choisie de la liste de chanson locale
          index = random(tmpSongs.length+1); //Je choisi la prochaine
        }

        //Je fais une promesse pour ajouter la liste de fav à l'user
        var query = doc;
        var update = { $set: {favoriteSongs: fav} };
        var promise =
          Q.npost(Users, 'update', [query, update])
          .then(function(updated){
            //console.log('Updated: ' + updated);
          });
        promises.push(promise);
      } else {
        //J'execute toute mes promesses d'update
        Q.all(promises)
        .then(function() {
          if (cursor.isClosed()) {
            console.log('favorite lists updated');
            db.close(); //Je referme la DB quand elles sont terminées
          }
        })
        .fail(console.error);
      }
    });
  });
});
