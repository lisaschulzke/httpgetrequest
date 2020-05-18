let express = require('express');
let axios = require('axios').default
const cors = require('cors');
let app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(cors());
let uri = 'https://gist.githubusercontent.com/fg-uulm/666847dd7f11607fc2b6234c6d84d188/raw/2ca994ada633143903b10b2bf7ada3fd039cae35/mensa.json';
let data = '';

//using mongodb
const mongo = require('mongodb').MongoClient;



axios({
  method: 'get',
  url: uri,
  responseType: 'json',
})
  .then((response) => {
    const output = response.data;
    console.log(output);
    data = output;
  });


//Params - REST-artig
// app.get('/mensa/:day', function(req, res) {
//   switch (req.params.day) {
//     case 'Mo':
//       res.send('This day has not been set yet.')
//       break;
//     case 'Di':
//       res.send(data);
//       break;
//     case 'Mi':
//       res.send('This day has not been set yet.')
//       break;
//     case 'Do':
//       res.send('This day has not been set yet.')
//       break;
//     case 'Fr':
//       res.send('This day has not been set yet.')
//       break;
//     default:
//       res.send('Choose a day between Mo and Fr.')
//   };
// });



async function initMongoDB() {
  const client = await mongo.connect('mongodb://localhost:27017/mensa')
    // eslint-disable-next-line no-console
    .catch((err) => { console.log(err); });
  const db = await client.db();
  return db;
}
//hinzufügen von einem Objekt als neues Element
async function updateDataBase(data) {
  const db = await initMongoDB();
  const addData = await db.collection('essen').insertOne(data, (err) => {
    if (err) throw err;
    console.log('Successfully updated!');
  });
  return addData;
}

//Element suchen und ausgeben
async function getFromDataBase(keyword) {
  const db = await initMongoDB();
  const getData = await db.collection('essen').find(keyword).toArray();
  return getData;
}



app.get('/user/:uid', (req, res) => {
  res.send(`User ID is set to ${req.params.uid}`);
});

app.get('/mensa/:day', async (req, res) => {
  const findResults = await getFromDataBase({day: req.params.day});
  if (findResults.length > 0) {
    res.send(findResults);
  } else {
    res.status(404).send('Error: 404');
  }
});

let postedData = [];

//rausfinden, ob daten für Tag schon mit der gleichen kategorie und name existieren
app.post('/form_data', (req,res,)=>{
  Object.keys(req.body).forEach(async (essen) => {
    const findResults = await getFromDataBase(essen);
    if (findResults.length === 0) {
      await updateDataBase(req.body[essen]);
      res.status(200).send();
    } else {
      res.status(409).send('This meal already exists.');
    }
  })
  let findResults = postedData.find(essen => essen.category === req.body.category && essen.day === req.body.day)

  if (findResults == undefined) {
    postedData.push(req.body);;
    res.status(200).send();
  } else {
    res.status(418).send();
  }
  // postedData.push(req.body)
  // res.send("OK");
});

//to try it in postman
app.get('/getFormData', (req,res)=>{
  res.send(postedData);
});


//Server starten
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
