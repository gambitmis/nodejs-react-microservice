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
    console.log('--- start create comment');
    const commentId = randomBytes(4).toString('hex');
    const { content } = req.body;

    const comments = commentByPostId[req.params.id] || [];
    comments.push({ id: commentId, content, status:'pending' });
    commentByPostId[req.params.id] = comments;
    await axios.post('http://event-bus:4005/events',{
        type: 'CommentCreated',
        data: {
            id: commentId,
            content,
            postId: req.params.id,
            status: 'pending'
        }
    }).catch((err) => {
        console.log(err.message);
    });
    res.status(201).send(comments);
    console.log('--- finish create comment')
});

app.post('/events', async (req,res) => {
    console.log('--- Start Recv Events');
    console.log('Receive Event',req.body.type);

    const { type, data } = req.body;

    if (type === 'CommentModerated'){
        const { postId, id, status, content } = data;
        const comments = commentByPostId[postId];

        const comment = comments.find(comment => {
            return comment.id === id;
        });
        comment.status = status;

        await axios.post('http://event-bus:4005/events', {
            type: 'CommentUpdated',
            data: {
                id,
                status,
                postId,
                content
            }
        }).catch((err) => {
            console.log(err.message);
        });
    }

    res.send({});
    console.log('--- Finish Recv Events');
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});