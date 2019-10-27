import mongoose from 'mongoose';
import AWS from 'aws-sdk';
import express from 'express';
import auth from '../../auth';
import keys from '../../../config/keys';

const router = express.Router();

const Project = mongoose.model('Project');

const s3 = new AWS.S3({
  accessKeyId: keys.awsAccessKey,
  secretAccessKey: keys.awsSecretAccessKey,
});

// POST new article
router.post('/new', auth.required, async (req, res) => {
  const { body: { article } } = req;
  if (article) {
    try {
      // Query project
      const project = await Project.findOne({ name: 'Mouseflow' });

      // Make changes to project

      // Find a section by name
      let section = project.sections.find(element => element.name === article.section);

      if (!section) {
        // If there is no section found, create one
        const index = project.sections.push({
          _id: new mongoose.Types.ObjectId(),
          name: article.section,
          children: [],
        });
        section = project.sections[index - 1];
      }

      // Create child element for section
      const child = {
        _id: new mongoose.Types.ObjectId(),
        type: 'article',
        name: article.name,
        slug: article.slug,
      };
      section.children.push(child);
      // Update in database
      try {
        await Project.findOneAndUpdate({ name: 'Mouseflow' }, project, { new: true });
      } catch (err) {
        return res.status(400).json({
          errors: {
            project: 'Unable to update project',
            err: err.message,
          },
        });
      }
      // S3 Upload
      const params = {
        Bucket: 'soutendijk-habit-dev',
        Key: `${child._id}.md`,
        Body: article.content.data,
      };
      try {
        s3.upload(params, (err) => {
          if (err) throw err;
        });
      } catch (err) {
        return res.status(400).json({
          errors: {
            s3: 'Unable to save file',
            err: err.message,
          },
        });
      }
      return res.send(article.content);
    } catch (err) {
      return res.json({
        errors: {
          section: 'Unable to create new article',
        },
      });
    }
  }
  return res.status(400).json({
    errors: {
      article: 'Invalid article object',
    },
  });
});

// GET content
router.get('/:articleId', auth.optional, async (req, res) => {
  const { params: { articleId } } = req;
  try {
    const params = {
      Bucket: 'soutendijk-habit-dev',
      Key: `${articleId}.md`,
    };
    s3.getObject(params, (err, data) => {
      if (err) throw err;
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

// PATCH content
router.patch('/:articleId', auth.required, async (req, res) => {
  const { params: { articleId }, body: { article } } = req;
  if (article) {
    try {
      // Query project
      const project = await Project.findOne({ name: 'Mouseflow' });

      // Make changes to project
      const section = project.sections.find(element => element.name === article.section);
      let child = section.children.find(element => element._id.toString() === articleId);
      if (!section) {
        // Create New Section
      } else if (!child) {
        // Move Article
        // Delete old child
        const prevSection = project.sections.find(element => (
          element.children.find(innerElement => (
            innerElement._id.toString() === articleId
          ))
        ));
        prevSection.children = prevSection.children.filter(element => (
          element._id.toString() !== articleId
        ));
        // If old section is empty
        if (!prevSection.children.length) {
          // Delete the empty section
          project.sections = project.sections.filter(element => element !== prevSection);
        }
        // Create new child
        child = {
          _id: new mongoose.Types.ObjectId(),
          type: 'article',
          name: article.name,
          slug: article.slug,
        };
        section.children.push(child);
      } else {
        child.name = article.name;
        child.slug = article.slug;
      }
      // Update in database
      await Project.findOneAndUpdate({ name: 'Mouseflow' }, project, { new: true });
      // S3 Upload
      const params = {
        Bucket: 'soutendijk-habit-dev',
        Key: `${child._id}.md`,
        Body: article.content.data,
      };
      try {
        s3.upload(params, (err) => {
          if (err) throw err;
        });
      } catch (err) {
        return res.status(400).json({
          errors: {
            s3: 'Unable to save file',
          },
        });
      }
      return res.send(article.content);
    } catch (err) {
      return res.status(400).json({
        errors: {
          section: `Unable to patch ${articleId}`,
        },
      });
    }
  }
  return res.status(400).json({
    errors: {
      article: 'Invalid article object',
    },
  });
});

module.exports = router;
