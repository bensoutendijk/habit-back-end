const mongoose = require('mongoose');
const router = require('express').Router({ mergeParams: true });
const auth = require('../auth');

const Project = mongoose.model('Project');
const User = mongoose.model('User');

// POST add Section
router.post('/', auth.required, async (req, res) => {
  if (req.payload) {
    const userId = req.payload._id;
    try {
      const user = await User.findOne({ _id: userId });
      if (user.permissions.indexOf('write') > -1) {
        const { params: { projectId } } = req;
        const section = req.body;
        if (section) {
          try {
            const finalProject = await Project.findOneAndUpdate(
              { _id: projectId },
              { $push: { children: section } },
            );
            res.send(finalProject);
          } catch (err) {
            res.status(400).json({
              errors: {
                section: 'Something went wrong',
              },
            });
          }
        }
      }
      res.status(401).json({
        errors: {
          user: 'Unauthorized user',
        },
      });
    } catch (err) {
      res.status(400).json({
        errors: {
          user: 'Unauthenticated user',
        },
      });
    }
  }
  return res.json({
    errors: {
      section: 'Something went wrong',
    },
  });
});

// GET section
router.get('/:sectionId', auth.optional, async (req, res) => {
  const { params: { projectId, sectionId } } = req;
  try {
    const { children } = await Project.findOne({ _id: projectId });
    children.forEach((child) => {
      if (child._id.toString() === sectionId) res.send(child);
    });
    throw new Error(`Unable to find sectionId: ${sectionId} in project: ${projectId}`);
  } catch (err) {
    res.json({
      errors: {
        section: `Unable to find sectionId: ${sectionId} in project: ${projectId}`,
      },
    });
  }
});

// PATCH section
router.patch('/:sectionId', auth.required, async (req, res) => {
  const userId = req.payload._id;
  const { params: { projectId, sectionId }, body: { section } } = req;
  if (section) {
    try {
      const { children } = await Project.findOneAndUpdate(
        { userId, _id: projectId, 'children._id': sectionId },
        { $set: { 'children.$': section } },
      );
      children.forEach((child) => {
        if (child._id.toString() === sectionId) res.send(child);
      });
      throw new Error(`Unable to find sectionId: ${sectionId} in project: ${projectId}`);
    } catch (err) {
      res.json({
        errors: {
          section: `Unable to update section _id: ${sectionId}`,
        },
      });
    }
  }
});

// DELETE section
router.delete('/:sectionId', auth.required, async (req, res) => {
  const userId = req.payload._id;
  const { params: { projectId, sectionId } } = req;
  try {
    const { children } = await Project.findOneAndUpdate(
      { userId, _id: projectId },
      { $pull: { children: { _id: sectionId } } },
    );
    children.forEach((child) => {
      if (child._id.toString() === sectionId) res.send(child);
    });
    throw new Error(`Unable to find sectionId: ${sectionId} in project: ${projectId}`);
  } catch (err) {
    res.json({
      errors: {
        section: `Unable to delete sectionId: ${sectionId} in project: ${projectId}`,
      },
    });
  }
});

module.exports = router;
