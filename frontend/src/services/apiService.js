import axios from 'axios';

export const loginUser = async (email ,password) => {
    try {
      const response = await axios.post('http://localhost:3000/auth/login', { email, password });
      return response.data;
    } catch (error) {
      throw error;
    }
};

export const registerUser = async (username,email,password) => {
    try {
      const response = await axios.post('http://localhost:3000/auth/register', { username,email,password });
      return response.data;
    } catch (error) {
      throw error;
    }
};

export const getPublicPosts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/auth/publicPosts');
      return response.data;
    } catch (error) {
      throw error;
    }
};

export const getFollowedPosts = async (userId, token) => {
    try {
      const response = await axios.get(`http://localhost:3000/auth/followingPosts/${userId}`,{
          headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
}

export const likePost = async (postId, token) => {
    try {
      const response = await axios.post(`http://localhost:3000/auth/likePost/${postId}`,{},{
          headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
}

export const unlikePost = async (postId, token) => {
    try {
      const response = await axios.post(`http://localhost:3000/auth/unLikePost/${postId}`,{},{
          headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
}


export const createPost = async (title, content, country, date_of_visit, token) => {
  try {
    const response = await axios.post('http://localhost:3000/auth/createPost', { title, content, country, date_of_visit }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updatePost = async (postId, title, content, country, date_of_visit, token) => {
  try {
    const response = await axios.put(`http://localhost:3000/auth/updatePost/${postId}`, { title, content, country, date_of_visit }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const getProfile = async (userId, token) => {
  try {
    const response = await axios.get(`http://localhost:3000/auth/profile/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const getPostsByUserId = async (userId, token) => {
  try {
    const response = await axios.get(`http://localhost:3000/auth/posts/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const deletePost = async (postId, token) => {
  try {
    const response = await axios.delete(`http://localhost:3000/auth/deletePost/${postId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}


export const getPostByPostId = async (postId, token) => {
  try {
    const response = await axios.get(`http://localhost:3000/auth/getPost/${postId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const followUser = async (followUserId, token) => {
  try {
    const response = await axios.post(`http://localhost:3000/auth/follow/${followUserId}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const unfollowUser = async (followingUserId, token) => {
  try {
    const response = await axios.delete(`http://localhost:3000/auth/unfollow/${followingUserId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const searchPosts = async ({ username, country }) => {
  try {

    const response = await axios.get('http://localhost:3000/auth/posts/search', {
      params: { username, country }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const followingPostsBySearch = async (userId, token, {username, country}) => {
  try {
    const response = await axios.get(`http://localhost:3000/auth/followingPostsBySearch/${userId}?username=${username}&country=${country}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}



