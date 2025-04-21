import React, { useEffect, useState } from 'react';
import './styles/index.css';
import { getPublicPosts, getFollowedPosts, likePost, unlikePost, searchPosts, deletePost,followingPostsBySearch } from './services/apiService';
import PostCard from './SharedComponents/PostCard';
import { jwtDecode } from 'jwt-decode';
import SharedSnackbar from './SharedComponents/SharedSnackbar';
import { useNavigate, useLocation } from 'react-router-dom';

const Home = () => {
  const [activeTab, setActiveTab] = useState('public');
  const [posts, setPosts] = useState([]);
  const [userId, setUserId] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');

  const queryParams = new URLSearchParams(location.search);
  const searchusername = queryParams.get('username');
  const searchcountry = queryParams.get('country');

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserId(decodedToken.userId);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [activeTab, userId, token, searchusername, searchcountry]);

  const fetchData = async () => {
    try {
      if (activeTab === 'public') {
        if (searchusername || searchcountry) {
          const response = await searchPosts({ username: searchusername, country: searchcountry });
          setPosts(response.results);

        } else {
          const response = await getPublicPosts();
          setPosts(response.posts);
        }

        
      } else if (activeTab === 'following' && userId) {
        if (searchusername || searchcountry) {
          const response = await followingPostsBySearch(userId, token, {username: searchusername, country: searchcountry });
          setPosts(response.posts);

        } else {
          const response = await getFollowedPosts(userId, token);
          setPosts(response.posts);
        }
      }
    } catch (error) {
      setPosts([]);
      console.error('Error fetching posts:', error);
    }
  };

  const handleLike = async (postId) => {
    try {
      await likePost(postId, token);
      fetchData();
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleDislike = async (postId) => {
    try {
      await unlikePost(postId, token);
      fetchData();
    } catch (error) {
      console.error('Error disliking post:', error);
    }
  }

  const handleUpdate = (postId) => {
    setTimeout(() => {
      navigate(`/update/${postId}`);
    }, 1500);
  };

  const handleDelete = async (postId) => {
    try {
      await deletePost(postId, token);
      setSnackbar({ open: true, message: 'Post deleted successfully', severity: 'success' });
      fetchData();
    } catch (error) {
      console.error('Failed to delete post', error);
      setSnackbar({ open: true, message: 'Failed to delete post', severity: 'error' });
    }
  };

  return (
    <div className='home-container'>
      <div className='toggle-buttons'>
        <button className={activeTab === 'public' ? "active" : ""}
          onClick={() => setActiveTab('public')}> For You
        </button>

        {token && (
          <button className={activeTab === 'following' ? "active" : ""}
            onClick={() => setActiveTab('following')}> Following
          </button>
        )}
      </div>

      <div className="posts-container">
        {posts.length > 0 ? (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              userId={userId}
              onLike={handleLike}
              onDislike={handleDislike}
              onUpdate={() => handleUpdate(post.id)}
              onDelete={() => handleDelete(post.id)}
            />
          ))
        ) : (
          <div className="no-posts-message">
            <p>No posts to show.</p>
          </div>
        )}
      </div>
      <SharedSnackbar snackbar={snackbar} setSnackbar={setSnackbar} />
    </div>
  );
};

export default Home;
