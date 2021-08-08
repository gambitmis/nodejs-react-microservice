const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const port = 4005;
const app = express();

app.use(bodyParser.json());

app.post('/events', (req,res) => {
    const event = req.body;
    axios.post('http://post:4001/events',event);
    axios.post('http://comment:4002/events',event);
    axios.post('http://localhost:4003/events',event);

    res.send({ status: 'OK'});
});

app.listen(4005, () => {
        console.log(`Listening on port ${port}`);
});