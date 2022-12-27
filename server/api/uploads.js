const router = require('express').Router();
const { db, bucket } = require('../../firebase');
const stream = require('stream');

// POST /api/:download flag
router.post('/:download', async (req, res, next) => {
  try {
    const ip = req.headers['x-forwarded-for'];
    const download = req.params.download === '1' ? true : false
    
    const bodyParts = req.body.song.split('#')
    const name = bodyParts[1];
    
    const repaired = bodyParts[0].split(' ').join('+');

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
