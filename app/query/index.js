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
    console.log('--- start req post')
    console.log('Receive Event', req.body);
    res.send(posts);
    console.log(posts)
});

app.post('/events', (req,res) => {
    console.log('--- start receive event')
    console.log('Receive Event',req.body.type);

    const { type, data } = req.body;
    if (type === 'PostCreated'){
        console.log('Event Postcreated');
        const { id, title } = data;

        posts[id] = { id, title, comments: [] }
    } else if (type === 'CommentCreated'){
        console.log('Event CommentCreated');
        const { id, content, postId, status } = data;
        const post= posts[postId];
      
        post.comments.push({ id, content , status });
    } else if (type === 'CommentUpdated'){
        console.log('Event CommentUpdated');
        const { id, content , postId, status } = data;

        const post = posts[postId];
        const comment = post.comments.find(comment => {
            console.log('Find comment.id');
            return comment.id === id;
        });

        comment.status = status;
        comment.content = content;
        
    } else {
        console.log('Error Undefine type');
    }
    console.log(posts);
    res.send({})
    console.log('--- finish receive event');
});

app.listen(port, ()=> {
    console.log(`Listening on port ${port}`);
});