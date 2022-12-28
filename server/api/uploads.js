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

    const contentString = `data:audio/wav;base64, ${repaired}`

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
          content: contentString,
          path: `${name}.wav`,
        },
      ],
    };
    
    const { data } = await axios.request(options);
    const hash = data[0].path;

    await db.collection('uploads').add({
      time: new Date().toLocaleString(),
      ip: ip,
      name: name,
      hash: hash,
      download: download
    });

    res.send('ok');
  } catch (error) {
    console.log(error);
    next(error);
  }
});

async function uploadToIPFS(path, content){
 
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
          content,
          path,
        },
      ],
    };
    const { data } = await axios.request(options);
    const hash = data[0].path;
    return hash
}

module.exports = router;
