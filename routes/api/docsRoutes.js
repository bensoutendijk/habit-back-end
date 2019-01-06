const docs = require('../../docs');
const router = require('express').Router();

module.exports = app => {
  app.get(
    '/api/docs/:docsId', (req, res) => {
      res.send(docs);
    }
  );
};