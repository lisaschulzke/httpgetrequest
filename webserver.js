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

mongo.connect(url, function(err, db) {
  if (err) throw err;
  database = db.db("databaseMensa");
  let myObj = {name: "Pizza", day:"Mi", category:"H1"};
  database.collection("meals").insertOne(myObj, function(err, res) {
    if (err) throw err;
    console.log("1 documented inserted!");
  });

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

app.get('/mensa/:day', (req, res) => {
  if (req.params.day === 'Di') {
    let data = {data: "data"}
    database.collection("meals").findOne(data, function(err, result) {
      if(err) throw err;
      console.log(result);
      res.send(result);
    })
  } else {
    res.status(404).send('404');
  }
});


app.post('/mensa/insert',(req, res, next) =>{
  let data = {data: req.body};
  database.collection("meals").insertOne(data, function(err, res) {
    if (err) throw err;
    console.log("1 documented inserted!");
    // database.close();
  });
  res.status(200).send('OK');
});


//start server
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
