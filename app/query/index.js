const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const port = 4003

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

// posts === {
//     'postid111': {
//         id: 'commentid111',
//         title: 'post title',
//         comments: [
//             { id: 'memtid1111', content:'comment!'}
//         ]
//     },
//     'postid2111': {
//         id: 'commentid2111',
//         title: 'post title',
//         comments: [
//             { id: 'memtid1111', content:'comment!'}, { id: 'memtid2222', content:'comment222!'},
//         ]
//     },
// }

app.get('/posts', (req,res) => {
    res.send(posts);
});

app.post('/events', (req,res) => {
    console.log('Receive Event',req.body.type);

    const { type, data } = req.body;
    if (type === 'PostCreated'){
        const { id, title } = data;

        posts[id] = { id, title, commets: [] }
    } else if (type === 'CommentCreated'){
        const { id, content, postId, status } = data;

        const post= posts[postId];

        post.commets.push({ id, content , status });
    } else {
        console.log('Error Undefine type');
    }
    console.log(posts);
    res.send({})
});

app.listen(port, ()=> {
    console.log(`Listening on port ${port}`);
});