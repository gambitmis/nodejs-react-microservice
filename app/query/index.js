const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const port = 4003

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

const handleEvent = (type, data) => {
    
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
};
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

    handleEvent(type,data);

    //console.log(posts);
    res.send({})
    console.log('--- finish receive event');
});

app.listen(port, async () => {
    console.log(`Listening on port ${port}`);

    try {

        const res = await axios.get('http://event-bus:4005/events').catch((err) => {
            console.log(err.message);
        });

        for (let event of res.data) {
            console.log('Processing event:',event.type);
            handleEvent(event.type,event.data);
        }

    }catch (error){
        console.log(error.message);
    }
});