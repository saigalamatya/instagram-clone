import React, { useState, useEffect } from 'react';
import './Post.css';
import { db } from './firebase';
import firebase from 'firebase';
import Avatar from '@material-ui/core/Avatar';

function Post({ postId, user, username, caption, imageUrl }) {

  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');

  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection('posts')
        .doc(postId)
        .collection('comments')
        .orderBy('timestamp', 'desc')
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }

    return () => {
      unsubscribe();
    };
  }, [postId]);

  const postComment = (event) => {
    event.preventDefault();

    db.collection('posts').doc(postId).collection('comments').add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      text: comment,
      username: user.displayName
    });

    setComment('');
  }

  return (
    <div className="post">
      <div className="post__header">
        <Avatar
          className="post__avatar"
          alt="SaigalAmatya"
          src="/static/images/avatar/1.jpg"
        />
        <h3>{username}</h3>
      </div>

      <img
        className="post__image"
        src={imageUrl}
        alt="" />

      <h4 className="post__text"><strong>{username}</strong>&nbsp;{caption}</h4>

      <div className="post__comments">
        {comments.map((comment) => (
          <p>
            <b>{comment.username}&nbsp;</b>{comment.text}
          </p>
        ))}
      </div>
      {user && (
        <form className="post__commentBox">
          <input
            className="post__input"
            type="text"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            className="post__button"
            disabled={!comment}
            type="submit"
            onClick={postComment}
          >
            Post
        </button>
        </form>
      )}

    </div>
  )
}

export default Post;