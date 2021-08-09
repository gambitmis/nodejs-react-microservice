const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const port = 4004

const app = express();
app.use(bodyParser.json());

app.post('/events', async (req,res) => {
    const { type, data } = req.body;

    if (type === 'CommentCreated') {
        const status = data.content.includes('Orange') ? 'rejected' : 'approved';
        await axios.post('http://event-bus:4005/events', { 
            type: 'commentModerated',
            data: {
                id: data.id,
                postId: data.postId,
                status,
                content: data.content
            }
        });
    }
});

app.listen(port,() => {
    console.log(`Listening on port ${port}`);
});