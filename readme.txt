Celebrity Gossip Microblogging Website

Author
Arpita Dev
University of Minnesota-Twin Cities
CSCI 4131 Final Project

Introduction
Welcome to the Celebrity Gossip Microblogging Website, a platform inspired by Reddit,
dedicated to sharing and discussing the latest celebrity gossip.
Users can make, view, like, edit, or delete posts about various celebrity-related topics.
This project allows a lively and interactive user experience for all things celebrity gossip.

Getting Started

Prerequisites:
Node.js installed on your machine.
A MySQL server running for the database.

Installation:
Download the Project
Download the project ZIP from the repository and extract it.

Install Dependencies:
Navigate to the project directory in your terminal and run:
npm install

Database Setup:
Ensure your MySQL server is running.
Create a database and necessary tables as per the schema provided in the project.
Update the database configuration in data.js with your credentials.

Start the Server:
Run the following command in one terminal:
node tunnel.js

Then run the following command in a second terminal while tunnel.js is running:
node server.js

Accessing the Website:
Open your web browser and go to localhost:4131.
This will land you on the homepage of the website.

Usage Guide

Registration and Login:
Users need to register and log in to create, view, like, edit, or delete posts.
Registration requires a unique email and a password meeting specific criteria
(minimum 8 characters, including uppercase, lowercase, and special characters).

Interacting with Posts:
Once logged in, users can create new posts using the 'Create Post' button.
Users can view all posts on the dashboard.
Users can like, edit, or delete any post, regardless of who created it.

Sorting and Pagination:
Posts can be sorted by the number of likes (from highest to lowest) or by date (from newest to oldest).
The dashboard supports pagination with a maximum of 5 posts per page.

Testing:
Ensure that all functionalities such as user registration, login, post creation, editing, liking, and deletion are working as intended.
Test the sorting functionality and pagination to ensure proper ordering and display of posts.

Notes
This project is designed for educational purposes as part of the CSCI 4131 course at the University of Minnesota-Twin Cities.
The website is intended to be run locally for testing and development purposes.

We hope you enjoy using the Celebrity Gossip Microblogging Website and find it a valuable resource for your celebrity gossip needs.
Happy posting!