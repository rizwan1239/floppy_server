const router = require('express').Router();
const Moralis = require('moralis/node');

// POST /api/uploads/:name
router.post('/:name/:address', async (req, res, next) => {
  try {
    const name = req.params.name;
    const address = req.params.address;
    const body = req.body.song;
    console.log(body);
    const body64 = Buffer.from(body).toString('base64');
    const Upload = Moralis.Object.extend('Upload');
    const upload = new Upload();
    upload.set('time', new Date().toISOString());
    upload.set('address', address);
    upload.set('name', name);
    upload.set('base64OG', body);
    upload.set('base64Converted', body64);
    upload.save().then(
      (upload) => {
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
