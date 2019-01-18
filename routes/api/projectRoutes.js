const mongoose = require('mongoose');
const router = require('express').Router();
const auth = require('../auth');

const Project = mongoose.model('Project');

router.use('/:projectId/sections', require('./sectionRoutes'));

// Get Project
router.get('/', auth.optional, async (req, res) => {
  const mouseflowProjectId = '5c3a8e0ea91c28317b436332';
  try {
    const project = await Project.findOne({ _id: mouseflowProjectId });
    res.send(project.toJSON());
  } catch (err) {
    res.status(400).json({
      errors: {
        project: 'Something went wrong',
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
