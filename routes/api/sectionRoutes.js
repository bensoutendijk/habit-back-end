const AWS = require('aws-sdk');

const mongoose = require('mongoose');
const router = require('express').Router({ mergeParams: true });
const auth = require('../auth');

const Project = mongoose.model('Project');
const User = mongoose.model('User');


const keys = require('../../config/keys');

const s3 = new AWS.S3({
  accessKeyId: keys.awsAccessKey,
  secretAccessKey: keys.awsSecretAccessKey,
});

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
          const sectionId = new mongoose.Types.ObjectId();
          Object.defineProperty(section, '_id', {
            value: sectionId,
          });
          try {
            // MongoDB save
            const finalProject = await Project.findOneAndUpdate(
              { _id: projectId },
              {
                $push: {
                  children: {
                    _id: sectionId,
                    name: section.name,
                    path: section.path,
                    content: section.content,
                  },
                },
              },
            );
            // S3 Upload
            const params = {
              Bucket: 'soutendijk-habit-dev',
              Key: `${section._id}.md`,
              Body: section.content,
            };
            try {
              s3.upload(params, (s3Err) => {
                if (s3Err) throw s3Err;
              });
            } catch (err) {
              res.status(400).json({
                errors: {
                  s3: 'Unable to save file',
                },
              });
            }
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

// GET content
router.get('/:sectionId', auth.optional, async (req, res) => {
  const { params: { sectionId } } = req;
  try {
    const params = {
      Bucket: 'soutendijk-habit-dev',
      Key: `${sectionId}.md`,
    };
    s3.getObject(params, (err, data) => {
      if (data) {
        res.send(data.Body.toString());
      } else {
        res.status(404).json({
          errors: {
            s3: 'Unable to find object',
          },
        });
      }
    });
  } catch (err) {
    res.status(400).json({
      errors: {
        s3: 'Unable to get object',
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
  if (req.payload) {
    const userId = req.payload._id;
    try {
      const user = await User.findOne({ _id: userId });
      if (user.permissions.indexOf('write') > -1) {
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
      }
      res.status(401).json({
        errors: {
          user: 'User authorized',
        },
      });
    } catch (err) {
      res.status(400).json({
        errors: {
          user: 'User unauthenticated',
        },
      });
    }
  }
  res.status(400).json({
    errors: {
      section: 'Something went wrong',
    },
  });
});

module.exports = router;
