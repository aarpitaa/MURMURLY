const mysql = require('mysql-await');

var connPool = mysql.createPool({
    connectionLimit: 5,
    host: "127.0.0.1",
    user: "C4131F23U56",
    database: "C4131F23U56",
    password: "3186",
    connectTimeout: 20000
});

// connPool.awaitQuery("CREATE TABLE users (id INT AUTO_INCREMENT PRIMARY KEY, fullname VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL UNIQUE, password VARCHAR(255) NOT NULL);");
// connPool.awaitQuery("CREATE TABLE posts (id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255) NOT NULL, description TEXT NOT NULL, user_id INT NOT NULL, likes INT DEFAULT 0, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);");

async function addUser(userData) {
    const sql = "INSERT INTO users (fullname, email, password) VALUES (?, ?, ?)";
    await connPool.awaitQuery(sql, [userData.fullname, userData.email, userData.password]);
}

async function getUserByEmail(email) {
    const sql = "SELECT * FROM users WHERE email = ?";
    const results = await connPool.awaitQuery(sql, [email]);
    return results[0];
}

async function getPosts(limit, offset) {
    const sql = "SELECT * FROM posts ORDER BY created_at DESC LIMIT ? OFFSET ?";
    return await connPool.awaitQuery(sql, [limit, offset]);
}

async function addPost(postData) {
    const sql = "INSERT INTO posts (title, description, user_id) VALUES (?, ?, ?)";
    await connPool.awaitQuery(sql, [postData.title, postData.description, postData.userId]);
    // Assuming each post is associated with a user, represented by 'user_id'
}

async function incrementLikeCount(postId) {
    // SQL code to increment the like count for the post
    const incrementSql = "UPDATE posts SET likes = likes + 1 WHERE id = ?";
    await connPool.awaitQuery(incrementSql, [postId]);
    
    // Retrieve the new like count to send back to the client
    const getLikesSql = "SELECT likes FROM posts WHERE id = ?";
    const result = await connPool.awaitQuery(getLikesSql, [postId]);
    
    return result[0].likes;
}

async function getPostCount() {
    const result = await connPool.awaitQuery("SELECT COUNT(*) as count FROM posts");
    return result[0].count;
}

async function getSortedPosts(limit, offset, orderBy) {
    // SQL query sorts all posts and applies limit and offset
    const sql = `SELECT * FROM posts ORDER BY ${orderBy} LIMIT ? OFFSET ?`;
    return await connPool.awaitQuery(sql, [limit, offset]);
}

async function updatePost(postId, title, description) {
    const sql = "UPDATE posts SET title = ?, description = ? WHERE id = ?";
    await connPool.awaitQuery(sql, [title, description, postId]);
}

async function deletePost(postId) {
    const sql = "DELETE FROM posts WHERE id = ?";
    await connPool.awaitQuery(sql, [postId]);
}

module.exports = { addUser, getUserByEmail, getPosts, addPost, incrementLikeCount, getPostCount, getSortedPosts, updatePost, deletePost };
