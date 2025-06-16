const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{ "username": "jeyms.doe", "password": "password" },];

const isValid = (username)=>{ 
  return users.some(user => user.username.toLowerCase() === username.toLowerCase());
}

const authenticatedUser = (username,password)=>{ 
  return users.some(user => user.username.toLowerCase() === username.toLowerCase() && user.password.toLowerCase() === password.toLowerCase());
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }

  // Check if the user exists
  if(!isValid(username)) {
    return res.status(404).json({message: "User not found"});
  }

  // Check if the username and password is correct
  if(!authenticatedUser(username, password)) {
    return res.status(403).json({message: "Incorrect password"});
  }

  // sign a JWT token for the user
  const jwtSecret = 'access'; // General secret for access tokens; in a real application, this should be more secure and stored in an environment variable
  let accessToken = jwt.sign({data: username}, jwtSecret, { expiresIn: 60 * 60 * 60 });
  req.session.authorization = { accessToken, username };
  return res.status(200).json({message: "User successfully logged in", accessToken});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  let book = books[isbn];

  if (!book) {
    return res.status(404).json({message: "Book not found"});
  }


  const review = req.body.review;
  const username = req.user;
  if (!review || !username) {
    return res.status(400).json({message: "Review and username are required"});
  }

  book["reviews"][username] = review;
  books[isbn] = book; // Update the book in the database
  return res.status(200).json({message: "Review added successfully", book});
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  let book = books[isbn];

  if (!book) {
    return res.status(404).json({message: "Book not found"});
  }

  const username = req.user;
  if (!username || !book["reviews"][username]) {
    return res.status(400).json({message: "Review not found for this user"});
  }

  delete book["reviews"][username];
  books[isbn] = book; // Update the book in the database
  return res.status(200).json({message: "Review deleted successfully", book});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
