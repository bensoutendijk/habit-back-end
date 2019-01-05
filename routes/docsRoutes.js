const docs = require('../docs');

module.exports = app => {
  app.get(
    '/api/docs/:docsId', (req, res) => {
      res.send(docs);
    }
  );
};