const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  const result = JSON.parse(JSON.stringify(books, null, 4));
  return res.status(200).json(result);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  try {
    const isbn = req.params.isbn;
    const result = books[isbn];
    if (!result) {
      return res.status(404).json({message: "Book not found"});
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({message: "Ops! Something went wrong"});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const result = Object.values(books).filter(book => book.author.toLowerCase() === author.toLowerCase());
  if (result.length > 0) {
    return res.status(200).json(result);
  } else {
    return res.status(404).json({message: "Books by this author not found"});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const result = Object.values(books).filter(book => book.title.toLowerCase() === title.toLowerCase());
  if (result.length > 0) {
    return res.status(200).json(result);
  } else {
    return res.status(404).json({message: "Books by this title not found"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  try {
    const isbn = req.params.isbn;
    const result = books[isbn].reviews;
    if(!result) {
      return res.status(404).json({message: "No reviews found for this book"});
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({message: "Ops! Something went wrong"});
  }
});

module.exports.general = public_users;
