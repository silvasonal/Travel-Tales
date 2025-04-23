const pool = require('../config/db');

const followUser = async (follower_id, following_id) => {
  const result = await pool.query(
    'INSERT INTO followers (follower_id, following_id) VALUES ($1, $2) ON CONFLICT (follower_id, following_id) DO NOTHING RETURNING *',
    [follower_id, following_id]
  );
  return result.rows[0];
};

const unfollowUser = async (follower_id, following_id) => {
  const result = await pool.query(
    'DELETE FROM followers WHERE follower_id = $1 AND following_id = $2 RETURNING *',
    [follower_id, following_id]
  );
  return result.rows[0];
};

const getUserById = async (userId) => {
  const result = await pool.query(`SELECT username, id FROM users WHERE id = $1`, [userId]);
  return result.rows[0];
};

const getFollowers = async (userId) => {
  const result = await pool.query(
    `SELECT users.username, users.id FROM followers JOIN users ON followers.follower_id = users.id WHERE followers.following_id = $1`,
    [userId]
  );
  return result.rows;
};

const getFollowing = async (userId) => {
  const result = await pool.query(
    `SELECT users.username, users.id FROM followers JOIN users ON followers.following_id = users.id WHERE followers.follower_id = $1`,
    [userId]
  );
  return result.rows;
};

const getFollowersCount = async (userId) => {
  const result = await pool.query(
    `SELECT COUNT(*) AS count FROM followers WHERE following_id = $1`,
    [userId]
  );
  return result.rows[0].count;
};

const getFollowingCount = async (userId) => {
  const result = await pool.query(
    `SELECT COUNT(*) AS count FROM followers WHERE follower_id = $1`,
    [userId]
  );
  return result.rows[0].count;
};

const getFollowingIds = async (userId) => {
  const result = await pool.query(
    `SELECT following_id FROM followers WHERE follower_id = $1`,
    [userId]
  );
  return result.rows.map(row => row.following_id);
};

const getFollowingPostsByUserIds = async (userIds) => {

  const placeholders = userIds.map((_, i) => `$${i + 1}`).join(',');

  const result = await pool.query(
    `SELECT posts.*, 
            users.username,
            COUNT(*) FILTER (WHERE likes.type = 1) AS likes,
            COUNT(*) FILTER (WHERE likes.type = -1) AS dislikes,
            ARRAY_AGG(likes.user_id) FILTER (WHERE likes.type = 1) AS "likedBy", -- Aggregates all user_ids who liked the post (type = 1) into a PostgreSQL array
            ARRAY_AGG(likes.user_id) FILTER (WHERE likes.type = -1) AS "dislikedBy"
     FROM posts
     JOIN users ON posts.user_id = users.id
     LEFT JOIN likes ON posts.id = likes.post_id
     WHERE posts.user_id IN (${placeholders})
     GROUP BY posts.id, users.username`,
    userIds
  );
  return result.rows;
};

const searchByFollowingPosts = async (userIds, username, country) => {
  const placeholders = userIds.map((_, i) => `$${i + 1}`).join(',');

  try{
  let query = `
    SELECT posts.*, 
           users.username, 
           COUNT(*) FILTER (WHERE likes.type = 1) AS likes,
           COUNT(*) FILTER (WHERE likes.type = -1) AS dislikes,
           ARRAY_AGG(likes.user_id) FILTER (WHERE likes.type = 1) AS "likedBy", 
           ARRAY_AGG(likes.user_id) FILTER (WHERE likes.type = -1) AS "dislikedBy"
    FROM posts
    JOIN users ON posts.user_id = users.id
    LEFT JOIN likes ON posts.id = likes.post_id`;

  let queryParams = [...userIds];
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
    query += ` WHERE posts.user_id IN (${placeholders}) AND ` + conditions.join(' AND ');  }

  query += `
    GROUP BY posts.id, users.username`;

    const result = await pool.query(query, queryParams);
    return result.rows;

  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
};


module.exports = {
  followUser,
  unfollowUser,
  getUserById,
  getFollowers,
  getFollowing,
  getFollowersCount,
  getFollowingCount,
  getFollowingIds,
  getFollowingPostsByUserIds,
  searchByFollowingPosts
};
