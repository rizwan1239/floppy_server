const router = require('express').Router();
const Moralis = require('moralis/node');

// POST /api/uploads
router.post('/', async (req, res, next) => {
  try {
    const Upload = Moralis.Object.extend('Upload');
    const upload = new Upload();
    upload.set('time', new Date().toISOString());
    upload.save().then(
      (upload) => {
        res.send('ok');
      },
      (error) => {
        res.send('error');
      }
    );
  } catch (error) {
    next(error);
  }
});

module.exports = router;
