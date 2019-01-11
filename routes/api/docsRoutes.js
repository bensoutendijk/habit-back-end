const mongoose = require('mongoose');
const router = require('express').Router();
const Document = mongoose.model('Document');

//POST new document route 
router.post('/', async (req, res) => {
  const { body: { document } } = req;
  const finalDocument = new Document(document)
  finalDocument.save()
    .then(() => res.json({ document: finalDocument.toJSON() }));
});

//GET index of documents route
router.get('/:id', async (req, res, next) => {
  const { params: { id } } = req;
  const document = await Document.findById(id);
  const tempDocument = {
    _id: '1',
    parent: '0',
    name: 'root',
    path: '/',
    body: null,
    children: [
      {
        _id: '2',
        parent: '1',
        name: 'Section 1',
        path: '/',
        body: 'Hello World. I am Section 1',
        children: null
      },
      {
        _id: '3',
        parent: '1',
        name: 'Section 2',
        path: '/',
        body: 'Hello World. I am Section 2',
        children: null
      },
      {
        _id: '4',
        parent: '1',
        name: 'Section 3',
        path: '/',
        body: null,
        children: [
          {
            _id: '5',
            parent: '4',
            name: 'Nested 1',
            path: '/',
            body: 'Hello World. I am Nested 1',
            children: null
          },
          {
            _id: '6',
            parent: '4',
            name: 'Nested 2',
            path: '/',
            body: 'Hello World. I am Nested 2',
            children: null
          },
        ]
      },
    ]
  }
  res.send(tempDocument);
});

module.exports = router;