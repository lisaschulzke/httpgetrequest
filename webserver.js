let express = require('express');
let axios = require('axios').default
const cors = require('cors');
let app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(cors());
let uri = 'https://gist.githubusercontent.com/fg-uulm/666847dd7f11607fc2b6234c6d84d188/raw/2ca994ada633143903b10b2bf7ada3fd039cae35/mensa.json';
let data = '';

axios({
  method: 'get',
  url: uri,
  responseType: 'json',
})

.then((response) => {
  const output = response.data;
  console.log(output);
  data = output;
})

app.get('/mensa/:day', (req, res) => {
  if (req.params.day === 'Di') {
    res.send(data);
  } else {
    res.status(404).send('404');
  }
});

let postedData = [];

app.post('/form_data', (req,res,next)=>{
  postedData.push(req.body)
  res.send("OK");
});


//Server starten
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
