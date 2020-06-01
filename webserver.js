//Requires / import libraries
let express = require('express');
let axios = require('axios').default
const cors = require('cors');
const mongo = require('mongodb').MongoClient;

//Variables
let app = express();
const bodyParser = require('body-parser');
let uri = 'https://gist.githubusercontent.com/fg-uulm/666847dd7f11607fc2b6234c6d84d188/raw/2ca994ada633143903b10b2bf7ada3fd039cae35/mensa.json';
let data = '';
let url = "mongodb://localhost:27017/mydb";
let database;


app.use(bodyParser.json());
app.use(cors());

mongo.connect(url, function (err, db) {
  if (err) throw err;
  database = db.db("databaseMensa");
  // let myObj = {name: "Pizza", day:"Mi", category:"H1"};
  // database.collection("meals").insertOne(myObj, function(err, res) {
  //   if (err) throw err;
  //   console.log("1 documented inserted!");
  // });

});


axios({
  method: 'get',
  url: uri,
  responseType: 'json',
}).then((response) => {
  const output = response.data;
  //console.log(output);
  data = output;
})

app.get('/mensa/:day', async (req, res) => {
  //if no category, many meals appear with findMany()
  let key = {
    day: req.params.day
  }
  console.log("params.day", req.params.day);
  // let result = await database.collection("meals").findOne(key)
  let result = await database.collection("meals").find(key).toArray()
  // result.forEach(item => console.log) 
  console.log("get", result);
  if (!result) {
    res.status(401).send("Error");
  }
  // let myDocument;
  // let docs = [];
  // while (result.hasNext()) {
  //   myDocument = await result.next();
  //   if (myDocument) {
  //     console.log("CURSORDATEN", myDocument);
  //     docs.push();
  //   }
  // }

  res.status(200).send(result);
});


app.post('/mensa', async (req, res, next) => {
  let data = req.body;
  console.log("Daten:", data);
  let key = {
    day: req.body.day,
    category: req.body.category
  }
  let result = await database.collection("meals").findOne({
    ...key
  });
  console.log("Database findone", result);
  if (!result) {
    result = await database.collection("meals").insertOne(data);
    console.log("insert one", result.ops)
  } else {
    let updated = {
      ...result,
      ...req.body
    }
    result = await database.collection("meals").updateOne({
      _id: result._id
    }, {
      $set: {
        ...updated
      }
    });
    console.log("update one", result.message.documents)
  }

  res.status(200).send('OK');
});


//start server
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});