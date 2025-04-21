import React from 'react';
import { BsPersonCircle } from 'react-icons/bs';
import { FaThumbsUp, FaThumbsDown, FaEdit,FaTrashAlt  } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';


const PostCard = ({ post, userId, onLike, onDislike, onDelete, onUpdate }) => {

  const isAuthor = userId === post.user_id; // Check if the current user is the author
  const navigate = useNavigate();
  

  const handleAuthorClick = (authorId) => {
    setTimeout(() => {
      navigate(`/profile/${authorId}`);
  } , 1500);
  };
  

  return (
    <div className="post-card">

      {isAuthor && (
        <div className="post-actions">
          <span onClick={onUpdate} className="actions-button update-icon" title="Edit Post">
            <FaEdit />
          </span>
          <span onClick={onDelete} className="actions-button delete-icon" title="Edit Post">
            <FaTrashAlt />
          </span>
        </div>
      )}
      
      <h3>{post.title}</h3>
      <p>{post.content}</p>
      <p><strong>Country:</strong> {post.country}</p>
      <p><strong>Visited on:</strong> {post.date_of_visit}</p>
      <p 
        className="author" 
        onClick={() => handleAuthorClick(post.user_id)} 
        style={{ cursor: 'pointer' }}
      >
        <BsPersonCircle className="nav-icon" /> {post.username}
      </p>


      <div className="likes-dislikes">
        <span
          onClick={() => onLike(post.id)}
          className={`icon-button ${post.likedBy?.includes(userId) ? 'reacted' : ''}`}
        >
          <FaThumbsUp /> {post.likes}
        </span>

        <span
          onClick={() => onDislike(post.id)}
          className={`icon-button ${post.dislikedBy?.includes(userId) ? 'reacted' : ''}`}
        >
          <FaThumbsDown /> {post.dislikes}
        </span>
      </div>

    </div>
  );
};

export default PostCard;
