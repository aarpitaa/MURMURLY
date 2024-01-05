const express = require('express');
const pug = require('pug');
const bcrypt = require('bcrypt');
const session = require('express-session');
const data = require('./data');

const app = express();
const port = 4131;

// Helper function to validate password
function validatePassword(password) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!?$])[A-Za-z\d!?$]{8,}$/;
    return regex.test(password);
}

// Helper function to validate email
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Session Middleware
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Middleware for parsing JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files from the 'resources' directory
app.use(express.static('resources'));

// Pug templates setup
app.set('view engine', 'pug');
app.set('views', './templates');

// Routes
app.get('/', (req, res) => {
    res.render('main');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/dashboard', async (req, res) => {
    if (!req.session.userId) {
        // Redirect to login if not authenticated
        return res.redirect('/login');
    }

    const page = parseInt(req.query.page) || 1; // Current page
    const sort = req.query.sort || 'date'; // Sorting criterion

    // Determine the order by clause based on the sort parameter
    let orderBy;
    if (sort === 'likes') {
        orderBy = 'likes DESC';
    } else {
        // Default sorting by date
        orderBy = 'created_at DESC';
    }

    const limit = 5; // Number of posts per page
    const offset = (page - 1) * limit; // Offset for pagination

    try {
        const totalPosts = await data.getPostCount(); // Get the total count of posts
        const pageCount = Math.ceil(totalPosts / limit); // Calculate the total number of pages

        // Fetch the sorted posts from the database
        const posts = await data.getSortedPosts(limit, offset, orderBy);

        // Render the dashboard with the fetched posts and other necessary data
        res.render('dashboard', {
            posts,
            currentPage: page,
            pageCount,
            sort
        });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).send('Error retrieving posts');
    }
});

app.get('/create-post', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/');
    }
    res.render('create-post');
});
    
// Route to handle post creation
app.post('/create-post', async (req, res) => {
    const { title, description } = req.body;
    const userId = req.session.userId;

    if (!userId) {
        return res.status(401).send('User not authenticated');
    }

    try {
        await data.addPost({ title, description, userId });
        res.redirect('/dashboard');
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).send('Error creating post');
    }
});

app.post('/register', async (req, res) => {
    const { fullname, email, password, repassword } = req.body;

    // Check if passwords match
    if (password !== repassword) {
        return res.status(400).send('Passwords do not match.');
    }

    // Check if the password is strong
    if (!validatePassword(password)) {
        return res.status(400).send('Password does not meet criteria.');
    }

    // Validate email format
    if (!validateEmail(email)) {
        return res.status(400).send('Invalid email format.');
    }

    try {
        // Check if user already exists
        const existingUser = await data.getUserByEmail(email);
        if (existingUser) {
            return res.status(400).send('User already exists with that email.');
        }

        // Encrypt password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Add user to the database
        await data.addUser({ fullname, email, password: hashedPassword });
        console.log("Redirecting to /login")

        // Redirect to login page after successful registration
        res.redirect('/login');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error registering new user');
    }
});
    
// Login route
app.post('/login', async (req, res) => {
    console.log("post/login")
    const { email, password } = req.body;
    console.log(email);
    console.log(password);

    const user = await data.getUserByEmail(email);
    console.log(user);
    if (user && await bcrypt.compare(password, user.password)) {
        // Set user ID in the session
        req.session.userId = user.id;
        // User authenticated, redirect to dashboard
        res.redirect('/dashboard');
    } else {
        // Authentication failed
        res.status(401).send('Invalid credentials');
    }
});
    
// Route to increment like count
app.post('/posts/:postId/like', async (req, res) => {
    const postId = req.params.postId;
    try {
        const updatedLikes = await data.incrementLikeCount(postId);
        res.json({ likes: updatedLikes });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error liking the post');
    }
});

app.post('/posts/update/:postId', async (req, res) => {
    const { postId } = req.params;
    const { title, description } = req.body;

    try {
        await data.updatePost(postId, title, description);
        res.json({ message: 'Post updated successfully' });
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).send('Error updating post');
    }
});

app.delete('/posts/delete/:postId', async (req, res) => {
    const { postId } = req.params;

    if (!req.session.userId) {
        return res.status(401).send('User not authenticated');
    }

    try {
        await data.deletePost(postId);
        res.status(200).send('Post deleted successfully');
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).send('Error deleting post');
    }
});
    
app.post('/logout', (req, res) => {
    // Destroy the user's session to log them out
    req.session.destroy((err) => {
        if (err) {
            console.error('Session destruction error:', err);
            return res.status(500).send('Error logging out');
        }
        res.redirect('/'); // Redirect to the main page after logout
    });
});
    
// 404 Error Page
app.use((req, res) => {
    res.status(404).render('404');
});


// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
