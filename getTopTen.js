'use strict'

const MongoClient = require('mongodb').MongoClient;

MongoClient.connect("mongodb://localhost:27017/music", function(err, db) {
  console.log("connected");
  console.log("---> Top 10:");

  var Notes = db.collection('notes');
  Notes.aggregate(
    [
      {$group: {_id: "$song", avgEval: {$avg: "$note"}}},
      {$sort: {avgEval: -1}},
      {$limit: 10}
    ]
  ).toArray()
  .catch(err => { console.log('aggregate error' + err); })
  .then(function(notes){
    notes.forEach(function(note){
      console.log(note._id.title + ": " + (Math.round(note.avgEval*100)/100) + " / 5");
    })
  })
  .catch(err => { console.log('printing error' + err); })
  .then(() => db.close());
});
