const axios = require('axios');
const router = require('express').Router();
const { db } = require('../../firebase');

// POST /api/:download flag
router.post('/:download', async (req, res, next) => {
  try {
    const ip = req.headers['x-forwarded-for'];
    const download = req.params.download === '1' ? true : false;
    // const bodyParts = req.body.song.split('#')
    // const name = bodyParts[1];
    // const repaired = bodyParts[0].split(' ').join('+');
    const name = req.body.path;
    console.log(req.body);
    const repaired = req.body.content['base64File'].split(' ').join('+');

    const options = {
      method: 'POST',
      url: 'https://deep-index.moralis.io/api/v2/ipfs/uploadFolder',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'X-API-Key': process.env.MORALIS_API_KEY,
      },
      data: [
        {
          path: `${name}.wav`,
          content: repaired,
        },
      ],
      maxBodyLength: Infinity,
    };

    const { data } = await axios.request(options);
    const hash = data[0].path.split('/ipfs/')[1];

    await db.collection('uploads').add({
      timestamp: Date.now(),
      ip: ip,
      name: name,
      hash: hash,
      download: download,
    });

    res.send('ok');
  } catch (error) {
    // console.log(error.message);
    next(error);
  }
});

module.exports = router;
