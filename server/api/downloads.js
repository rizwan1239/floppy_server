const router = require('express').Router();
const Moralis = require('moralis/node');

// POST /api/downloads/:address
router.post('/:address', async (req, res, next) => {
  try {
    const address = req.params.address;
    const song = JSON.parse(req.body.song);
    const repaired = song.base64File.split(' ').join('+');

    const Download = Moralis.Object.extend('Download');
    const download = new Download();
    download.set('time', new Date().toISOString());
    download.set('address', address);
    download.set('name', song.FileName);
    download.set('wavBase64', repaired);
    download.save().then(
      (download) => {
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
