import express from 'express';

const router = express.Router();

// POST new user route (optional, everyone has access)
router.post('/', async (req, res) => {
  const { body } = req;
  console.log(body);
  res.send(body);
});


export default router;
