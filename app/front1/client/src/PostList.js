import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CommentCreate from './CommentCreate';

const PostList = () => {
    const [posts, setPosts] = useState({});

    const fetchPosts = async () => {
      const res = await axios.get('http://localhost:3003/posts');  
      setPosts(res.data);
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    //console.log(posts);
    const renderedPosts = Object.values(posts).map( post => {
        return (
            <div className="card" style={{ width:'30%' , marginBottom: '20px' }} key={post.id} >
                <div className="card-body">
                    <h3>{post.title}</h3>
                    <CommentCreate/>
                </div>
            </div>
       );
    });

    return (
        <div className="d-flex flex-row flex-warp justify-content-center"> 
            {renderedPosts}
        </div>
    ); 
};

export default PostList;