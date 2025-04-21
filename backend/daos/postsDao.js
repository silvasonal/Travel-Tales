const pool = require('../config/db');

const createBlogPost = async (user_id, title, content, country, date_of_visit) => {
  try {
    const result = await pool.query(
      'INSERT INTO posts (user_id, title, content, country, date_of_visit) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [user_id, title, content, country, date_of_visit]
    );
    return result.rows[0];

  } catch (error) {
    console.error('Error in createPost:', error);
    throw new Error('Error creating post');
  }
};

const updateBlogPost = async (post_id, user_id, title, content, country, date_of_visit) => {
  try {
    const result = await pool.query(
      `UPDATE posts SET title = $1, content = $2, country = $3, date_of_visit = $4  WHERE id = $5 AND user_id = $6 RETURNING *`,
      [title, content, country, date_of_visit, post_id, user_id]
    );
    return result.rows[0];

  } catch (error) {
    console.error('Error in updatePost:', error);
    throw new Error('Error updating post');
  }
};

const deleteBlogPost = async (post_id, user_id) => {
  try {

    await pool.query(
      'DELETE FROM likes WHERE post_id = $1',
      [post_id]
    );
    
    const result = await pool.query(
      'DELETE FROM posts WHERE id = $1 AND user_id = $2 RETURNING *',
      [post_id, user_id]
    );

    return result.rows[0];

  } catch (error) {
    console.error('Error in deleteBlogPost:', error);
    throw new Error('Error deleting post');
  }
};

const getPostByPostId = async (post_id) => {
  try {
    const result = await pool.query(
      'SELECT * FROM posts WHERE id = $1',
      [post_id]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error in getPostByPostId:', error);
    throw new Error('Error fetching post');
  }
};

const getAllPublicPosts = async () => {
  try {
    const result = await pool.query(`
      SELECT posts.*, 
        users.username,
        COUNT(likes.*) FILTER (WHERE likes.type = 1) AS likes,
        COUNT(likes.*) FILTER (WHERE likes.type = -1) AS dislikes,
        ARRAY_AGG(likes.user_id) FILTER (WHERE likes.type = 1) AS "likedBy",
        ARRAY_AGG(likes.user_id) FILTER (WHERE likes.type = -1) AS "dislikedBy"
      FROM posts 
      JOIN users ON posts.user_id = users.id
      LEFT JOIN likes ON posts.id = likes.post_id
      GROUP BY posts.id, users.username
      ORDER BY posts.created_at DESC
    `);

    return result.rows;

  } catch (error) {
    console.error('Error in getAllPublicPosts:', error);
    throw new Error('Error fetching public posts');
  }
};

const searchBy = async (username, country) => {
  try {
    let query = `
        SELECT posts.*, users.username,
          COUNT(likes.*) FILTER (WHERE likes.type = 1) AS likes,
          COUNT(likes.*) FILTER (WHERE likes.type = -1) AS dislikes,
          ARRAY_AGG(likes.user_id) FILTER (WHERE likes.type = 1) AS "likedBy",
          ARRAY_AGG(likes.user_id) FILTER (WHERE likes.type = -1) AS "dislikedBy"
        FROM posts
        JOIN users ON posts.user_id = users.id
        LEFT JOIN likes ON posts.id = likes.post_id `;

    let queryParams = [];
    let conditions = [];

    if (username) {
      conditions.push(`LOWER(users.username) LIKE LOWER($${queryParams.length + 1})`);
      queryParams.push(`%${username}%`);
    }

    if (country) {
      conditions.push(`LOWER(posts.country) LIKE LOWER($${queryParams.length + 1})`);
      queryParams.push(`%${country}%`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += `
      GROUP BY posts.id, users.username
      ORDER BY posts.created_at DESC
      `;

    const result = await pool.query(query, queryParams);
    return result.rows;

  } catch (error) {
    console.error('Error in searchBy:', error);
    throw new Error('Error fetching posts by username or country');
  }
};

const getPostsById = async (userId) => {
  try {
    const result = await pool.query(`
      SELECT posts.*, 
        users.username,
        COUNT(likes.*) FILTER (WHERE likes.type = 1) AS likes,
        COUNT(likes.*) FILTER (WHERE likes.type = -1) AS dislikes,
        ARRAY_AGG(likes.user_id) FILTER (WHERE likes.type = 1) AS "likedBy",
        ARRAY_AGG(likes.user_id) FILTER (WHERE likes.type = -1) AS "dislikedBy"
      FROM posts 
      JOIN users ON posts.user_id = users.id
      LEFT JOIN likes ON posts.id = likes.post_id
      WHERE posts.user_id = $1
      GROUP BY posts.id, users.username
      ORDER BY posts.created_at DESC` ,
      [userId]
    );

    return result.rows;

  } catch (error) {
    console.error('Error in getPostsById:', error);
    throw new Error('Error fetching public posts');
  }
};


module.exports = { createBlogPost, updateBlogPost, deleteBlogPost,getPostByPostId, getAllPublicPosts, searchBy, getPostsById };
