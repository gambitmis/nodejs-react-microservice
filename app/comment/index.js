const express = require('express');
const { randomBytes } = require('crypto');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());
const port = 4002;

const commentByPostId = {};

app.get('/posts/:id/comments', (req,res) => {
    res.send(commentByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', async (req,res) => {
    const commentId = randomBytes(4).toString('hex');
    const { content } = req.body;

    const comments = commentByPostId[req.params.id] || [];
    comments.push({ id: commentId, content });
    commentByPostId[req.params.id] = comments;
    await axios.post('http://event-bus:4005/events',{
        type: 'CommentCreated',
        data: {
            id: commentId,
            content,
            postId: req.params.id
        }
    });
    res.status(201).send(comments);
});

app.post('/events', (req,res) => {
    console.log('Receive Event',req.body.type);
    res.send({});
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});