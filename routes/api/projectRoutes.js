const mongoose = require('mongoose');
const router = require('express').Router();
const auth = require('../auth');

const Project = mongoose.model('Project');

// POST create Project
router.post('/', auth.required, async (req, res) => {
  const { payload: { _id } } = req;
  const finalProject = new Project({
    userId: _id,
    children: [
      {
        name: 'Getting Started',
        path: '/',
        body: 'Welcome to Habit',
      },
    ],
  });

  try {
    await finalProject.save();
    res.send(finalProject.toJSON());
  } catch (err) {
    res.json({
      errors: {
        project: 'Something went wrong',
      },
    });
  }
});

// GET Projects
router.get('/', auth.required, async (req, res) => {
  const { payload: { _id } } = req;
  try {
    const projects = await Project.find({ userId: _id });
    res.send(projects);
  } catch (err) {
    res.json({
      errors: {
        projects: 'Something went wrong',
      },
    });
  }
});

// DELETE remove Project
router.delete('/:_id', async (req, res) => {
  const { params: { _id } } = req;
  try {
    const project = await Project.findOneAndDelete({ _id });
    res.send(project);
  } catch (err) {
    res.json({
      errors: {
        project: 'Something went wrong',
      },
    });
  }
});

// POST add Section
router.post('/:_id', async (req, res) => {
  const { params: { _id } } = req;
  const { body: { section } } = req;
  try {
    const finalProject = await Project.findOneAndUpdate(
      { _id },
      { $push: { children: section } },
    );
    res.send(finalProject);
  } catch (err) {
    res.json({
      errors: {
        section: 'Something went wrong',
      },
    });
  }
});

module.exports = router;
