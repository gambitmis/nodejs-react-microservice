const express = require('express');
const { randomBytes } = require('crypto');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());
const port = 4001;

const posts = {};

app.get('/posts', (req,res) => {
    console.log('--- req posts')
    res.send(posts);
    console.log(posts);
});

app.post('/posts', async (req,res) => {
    console.log('--- start create posts');
    const id = randomBytes(4).toString('hex');
    const { title } = req.body;

    posts[id] = {
        id, title
    };

    await axios.post('http://event-bus:4005/events', {
        type: 'PostCreated',
        data: {
            id, title
        }
    }).catch((err) => {
        console.log(err.message);
    });
    res.status(201).send([posts[id]]);
    console.log('--- finish create posts');
});

app.post('/events', (req,res) => {
    console.log('Recevied Event',req.body.type);
    res.send({});
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});