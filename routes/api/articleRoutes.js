const AWS = require('aws-sdk');

const router = require('express').Router({ mergeParams: true });
const auth = require('../auth');

const keys = require('../../config/keys');

const s3 = new AWS.S3({
  accessKeyId: keys.awsAccessKey,
  secretAccessKey: keys.awsSecretAccessKey,
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

module.exports = router;
