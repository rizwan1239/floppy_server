const router = require('express').Router();
const Moralis = require('moralis/node');

// POST /api/uploads/:name
router.post('/:name', async (req, res, next) => {
  try {
    const name = req.params.name;
    const body = req.body.song;
    const body64 = Buffer.from(body).toString('base64');
    const Upload = Moralis.Object.extend('Upload');
    const upload = new Upload();
    upload.set('time', new Date().toISOString());
    upload.set('name', name);
    upload.set('base64OG', body);
    upload.set('base64Converted', body64);
    upload.save().then(
      (upload) => {
        // console.log(upload.get(id));
        res.send('ok');
      },
      (error) => {
        console.log(error);
        res.send('error');
      }
    );
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;
