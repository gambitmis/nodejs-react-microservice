import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CommentList = ({ postId }) => {
    const [comments, setComments] = useState([]);
    const fetchData = async () => {
        const res = await axios.get(`http://localhost:4002/posts/${postId}/comments`);
        //console.log(res.data)
        setComments(res.data);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const renderedComments = comments.map( comment => {
        return <li key={comment.id}>{comment.content}</li>
    });
    return (
        <ul>{renderedComments}</ul>
    );
};

export default CommentList
 