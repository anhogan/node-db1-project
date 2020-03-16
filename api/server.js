const express = require("express");

const db = require("../data/dbConfig.js");

const server = express();

server.use(express.json());

server.post('/api/accounts', (req, res) => {
  // Validate that name is there / unique and that budget is there
  // Insert req.body

  db('accounts').insert()
    .then()
    .catch(error => {
      console.log(error);
      res.status(500).json({ message: "The account could not be created" });
    });
});

server.get('/api/accounts', (req, res) => {
  db('accounts')
    .then(accounts => {
      res.status(200).json(accounts);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ message: "The account information could not be retrieved" });
    });
});

server.get('/api/accounts/:id', (req, res) => {
  const { id } = req.params;

  db('accounts').where({ id })
    .then(account => {
      if (account.length) {
        res.status(200).json(account);
      } else {
        res.status(400).json({ message: "Invalid account id" });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ message: "The account information could not be retrieved" });
    });
});

server.delete('/api/accounts/:id', (req, res) => {
  const { id } = req.params;

  db('accounts').where({ id }).del()
    .then(count => {
      if (count > 0) {
        db('accounts')
          .then(accounts => {
            console.log('Successfully deleted the account');
            res.status(200).json(accounts);
          })
          .catch(error => {
            console.log(error);
            res.status(500).json({ message: "The account information could not be retrieved" });
          });
      } else {
        res.status(400).json({ message: "Invalid account id" });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ message: "The account could not be deleted" });
    });
});

server.put('/api/accounts/:id', (req, res) => {
  // Validate that name is there / unique and that budget is there
  // Update req.body
  
  const { id } = req.params;

  db('accounts').where({ id }).update()
    .then()
    .catch(error => {
      console.log(error);
      res.status(500).json({ message: "The account could not be updated" });
    });
});

module.exports = server;
