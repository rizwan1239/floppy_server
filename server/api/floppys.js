const router = require('express').Router();
const Moralis = require('moralis/node');

// GET /api/floppys/:id
router.get('/:id', async (req, res, next) => {
  try {
    const query = new Moralis.Query('Sample');
    query.equalTo('unlocked', true);
    query.equalTo('floppy', parseInt(req.params.id));

    const query2 = new Moralis.Query('Sample');
    query2.equalTo('unlocked', false);
    query2.equalTo('floppy', parseInt(req.params.id));

    const unlockedSamples = await query.find();
    const lockedSamples = await query2.find();

    const result = { locked: lockedSamples.length, unlocked: unlockedSamples };

    res.send(result);
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
    const unlockedSamples = await secondQuery.find();
    const lockedSamplesCount = locked.length ? locked.length - 1 : 0;

    const result = { locked: lockedSamplesCount, unlocked: unlockedSamples };

    res.send(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
