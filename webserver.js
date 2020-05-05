let express = require('express');
let axios = require('axios').default
let app = express();
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
  });


//Params - REST-artig
// app.get('/mensa/:day', function(req, res) {
//   switch (day) {
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

app.get('/user/:uid', (req, res) => {
  res.send(`User ID is set to ${req.params.uid}`);
});

app.get('/mensa/:day', (req, res) => {
  if (req.params.day === 'Di') {
    res.send(data);
  } else {
    res.status(404).send('404');
  }
});


//Server starten
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
