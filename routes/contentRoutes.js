module.exports = app => {
  app.get(
    '/api/content/:contentId', (req, res) => {
      res.send('ABC');
    }
  );
};