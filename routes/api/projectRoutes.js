const mongoose = require('mongoose');
const router = require('express').Router();
const auth = require('../auth');

const Project = mongoose.model('Project');

router.use('/:projectId/sections', require('./sectionRoutes'));

// POST create Project
router.post('/', auth.required, async (req, res) => {
  const userId = req.payload._id;
  const finalProject = new Project({
    userId,
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

// Get Project
router.get('/:projectId', auth.optional, async (req, res) => {
  const { params: { projectId } } = req;
  try {
    const project = await Project.findOne({ _id: projectId });
    res.send(project.toJSON());
  } catch (err) {
    res.json({
      errors: {
        project: 'Something went wrong',
      },
    });
  }
});

// GET Projects index
router.get('/', auth.required, async (req, res) => {
  const userId = req.payload._id;
  try {
    const projects = await Project.find({ userId });
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
router.delete('/:_id', auth.required, async (req, res) => {
  const userId = req.payload._id;
  const { params: { _id } } = req;
  try {
    const project = await Project.findOneAndDelete({ userId, _id });
    res.send(project);
  } catch (err) {
    res.json({
      errors: {
        project: 'Something went wrong',
      },
    });
  }
});

module.exports = router;
