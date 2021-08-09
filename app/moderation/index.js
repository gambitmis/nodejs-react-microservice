const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const port = 4004

const app = express();
app.use(bodyParser.json());

app.post('/events', async (req,res) => {
    console.log('--- start receive event');
    console.log('Received event',req.body.type);
    const { type, data } = req.body;

    if (type === 'CommentCreated') {
        console.log('CommentCreated');
        const status = data.content.includes('Orange') ? 'rejected' : 'approved';
        console.log('report comment status:',status);
        await axios.post('http://event-bus:4005/events', { 
            type: 'CommentModerated',
            data: {
                id: data.id,
                postId: data.postId,
                status,
                content: data.content
            }
        }).catch((err) => {
            console.log(err.message);
        });
    }
    console.log('--- finish receive event');
});

app.listen(port,() => {
    console.log(`Listening on port ${port}`);
});