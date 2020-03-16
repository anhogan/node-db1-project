const express = require("express");

const db = require("../data/dbConfig.js");

const server = express();

server.use(express.json());

server.post('/api/accounts', validateAccount, validateUniqueName, (req, res) => {
  db('accounts').insert(req.body)
    .then(account => {
      console.log('Successfully created the account');
      db('accounts')
        .then(accounts => {
          res.status(200).json({ data: accounts });
        })
        .catch(error => {
          console.log(error);
          res.status(500).json({ message: "The account information could not be retrieved" });
        });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ message: "The account could not be created" });
    });
});

server.get('/api/accounts', (req, res) => {
  db('accounts')
    .then(accounts => {
      res.status(200).json({ data: accounts });
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
        res.status(200).json({ data: account });
      } else {
        res.status(404).json({ message: "Invalid account id" });
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
        console.log('Successfully deleted the account');
        db('accounts')
          .then(accounts => {
            res.status(200).json({ data: accounts });
          })
          .catch(error => {
            console.log(error);
            res.status(500).json({ message: "The account information could not be retrieved" });
          });
      } else {
        res.status(404).json({ message: "Invalid account id" });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ message: "The account could not be deleted" });
    });
});

server.put('/api/accounts/:id', validateUniqueName, (req, res) => {
  const { id } = req.params;

  db('accounts').where({ id }).update(req.body)
    .then(count => {
      if (count > 0) {
        console.log('Successfully updated the account');
        db('accounts')
          .then(accounts => {
            res.status(200).json({ data: accounts });
          })
          .catch(error => {
            console.log(error);
            res.status(500).json({ message: "The account information could not be retrieved" });
          });
      } else {
        res.status(404).json({ message: "Invalid account id" });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ message: "The account could not be updated" });
    });
});

function validateAccount(req, res, next) {
  if (!req.body.name || !req.body.budget) {
    res.status(400).json({ message: "Account must have a name and a budget to be created" })
  } else {
    next();
  };
};

function validateUniqueName(req, res, next) {
  db('accounts')
    .then(accounts => {
      const accountNames = accounts.filter(account => { return account.name === req.body.name });
      if (accountNames.length) {
        res.status(400).json({ message: "Name already exists, please choose a unique value" });
      } else {
        next();
      }
    })
    .catch(error => {
      console.log(error);
    });
}

module.exports = server;
