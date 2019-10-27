import mongoose from 'mongoose';
// import AWS from 'aws-sdk';
import express from 'express';
import auth from '../../auth';
// import keys from '../../../config/keys';

const router = express.Router();

const Project = mongoose.model('Project');
const LocalUser = mongoose.model('LocalUser');

// const s3 = new AWS.S3({
//   accessKeyId: keys.awsAccessKey,
//   secretAccessKey: keys.awsSecretAccessKey,
// });

// Create project
router.post('/', auth.required, async (req, res) => {
  const { body: { name, visibility }, localAuth } = req;
  const localUser = await LocalUser.findById(localAuth._id);
  try {
    const project = new Project({
      localUser: localUser._id,
      name,
      visibility,
    });
    await project.save();
    return res.status('200').json({
      project,
    });
  } catch (err) {
    console.log(err.message);
    return res.sendStatus('400');
  }
});

// Get Projects
router.get('/', auth.required, async (req, res) => {
  const { localAuth } = req;
  const localUser = await LocalUser.findById(localAuth._id);
  if (localUser) {
    try {
      const projects = await Project.find({ localUser: localUser._id });
      return res.send(projects);
    } catch (err) {
      console.log(err.message);
      res.sendStatus(400);
    }
  }
  return res.sendStatus('400');
});

// Get One Project
router.get('/:projectId', auth.optional, async (req, res) => {
  const { params: { projectId } } = req;
  try {
    const project = await Project.findById(projectId);
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
router.delete('/:projectId', auth.required, async (req, res) => {
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
