const router = require('express').Router();
const { db, bucket } = require('../../firebase');
const stream = require('stream');

// POST /api/uploads/:name
router.post('/:name/:download', async (req, res, next) => {
  try {
    const name = req.params.name;
    const download = req.params.download === '1' ? true : false

    const ip = req.headers['x-forwarded-for'];
    const repaired = req.body.song.split(' ').join('+');

    const bufferStream = new stream.PassThrough();
    bufferStream.end(Buffer.from(repaired, 'base64'));

    const file = bucket.file(`${name}.wav`);

    bufferStream
      .pipe(file.createWriteStream())
      .on('error', (e) => {
        console.log(e);
      })
      .on('finish', () => {
        console.log(`file uploaded successfully`);
      });

    const result = await db.collection('uploads').add({
      time: new Date().toLocaleString(),
      ip: ip,
      name: name,
      pathRef: `${name}.wav`,
      download: download
    });

    res.send(result.id);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;
