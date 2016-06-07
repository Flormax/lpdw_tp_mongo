'use strict'

const faker = require('faker');
const MongoClient = require('mongodb').MongoClient;

var usersTab = [];
for(let i=0; i<1000; i++){
  usersTab.push({
    'username': faker.internet.userName(),
    'displayname': faker.internet.userName(),
    'email': faker.internet.exampleEmail()
  });
}

MongoClient.connect("mongodb://localhost:27017/music", function(err, db) {
  console.log("connected");
  db.createCollection(
    'users',
    {
      'validator':{
        $and:[
          { username: { $type: "string" } },
          { displayname: { $type: "string" } },
          { email: { $regex: /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i } }
        ]
      }
    }
  )
  .catch(err => { console.log('create error' + err); })
  .then((users) => users.remove({}))
  .catch(err => { console.log('remove error' + err); })
  .then(() => db.collection('users').insert(usersTab))
  .catch(err => { console.log('insert error' + err); })
  .then(function(){
    db.close();
    console.log('users collection has been created')
  });
})
