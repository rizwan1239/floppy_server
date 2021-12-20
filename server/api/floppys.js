const router = require('express').Router();
const Moralis = require('moralis/node');

// GET /api/floppys/:id
router.get('/:id', async (req, res, next) => {
  try {
    const query = new Moralis.Query('Sample');
    query.equalTo('unlocked', true);
    query.equalTo('floppy', parseInt(req.params.id));
    const singleFloppySamples = await query.find();

    res.send(singleFloppySamples);
  } catch (error) {
    next(error);
  }
});

// PUT /api/floppys/:id
router.put('/:id', async (req, res, next) => {
  try {
    const query = new Moralis.Query('Sample');
    query.equalTo('unlocked', false);
    query.equalTo('floppy', parseInt(req.params.id));
    const locked = await query.find();

    if (locked.length) {
      await locked[0].set('unlocked', true);
      await locked[0].save();
    }
    const secondQuery = new Moralis.Query('Sample');
    secondQuery.equalTo('unlocked', true);
    secondQuery.equalTo('floppy', parseInt(req.params.id));
    const unlocked = await secondQuery.find();
    res.send(unlocked);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
