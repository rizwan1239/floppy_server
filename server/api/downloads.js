const router = require('express').Router();
const Moralis = require('moralis/node');

// POST /api/downloads/:name
router.post('/:name', async (req, res, next) => {
  try {
    const name = req.params.name;
    const body = req.body.song;
    const body64 = Buffer.from(body).toString('base64');
    const Download = Moralis.Object.extend('Download');
    const download = new Download();
    download.set('time', new Date().toISOString());
    download.set('name', name);
    download.set('base64OG', body);
    download.set('base64Converted', body64);
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
