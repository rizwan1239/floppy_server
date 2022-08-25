const router = require('express').Router();
const Moralis = require('moralis/node');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// POST /api/uploads/:address
router.post('/:address', async (req, res, next) => {
  try {
    const address = req.params.address;
    const song = JSON.parse(req.body.song);
    const repaired = song.base64File.split(' ').join('+');

    const Upload = Moralis.Object.extend('Upload');
    const upload = new Upload();
    upload.set('time', new Date().toISOString());
    upload.set('address', address);
    upload.set('name', song.FileName);
    upload.set('wavBase64', repaired);
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
