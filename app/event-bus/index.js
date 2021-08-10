const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const port = 4005;
const app = express();

app.use(bodyParser.json());

const events = [];

app.post('/events', (req,res) => {
    const event = req.body;

    events.push(event);

    console.log('--- start send event to POST');
    axios.post('http://post:4001/events',event).catch((err) => {
        console.log(err.message)
    });
    console.log('--- start send event to Comment');
    axios.post('http://comment:4002/events',event).catch((err) => {
        console.log(err.message)
    });
    console.log('--- start send event to Query');
    axios.post('http://query:4003/events',event).catch((err) => {
        console.log(err.message);
    });
    console.log('--- start send event to Mod');
    axios.post('http://mod:4004/events',event).catch((err) => {
        console.log(err.message);
    });

    res.send({ status: 'OK'});
});

app.get('/events', (req,res) => {
    res.send(events);
});

app.listen(4005, () => {
        console.log(`Listening on port ${port}`);
});