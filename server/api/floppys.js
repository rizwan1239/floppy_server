const router = require('express').Router();
const { db } = require('../../firebase');

// GET /api/floppys/:id
router.get('/:id', async (req, res, next) => {
  try {
    const snapshot = db.collection('floppys');

    const queryUnlocked = await snapshot
      .where('floppy', '==', parseInt(`${req.params.id}`))
      .where('unlocked', '==', true)
      .get();

    const unlockedSamples = [];
    queryUnlocked.forEach((doc) => {
      unlockedSamples.push(doc.data());
    });

    const queryLocked = await snapshot
      .where('floppy', '==', parseInt(`${req.params.id}`))
      .where('unlocked', '==', false)
      .get();

    const lockedSamples = [];
    queryLocked.forEach((doc) => {
      lockedSamples.push(doc.id);
    });

    const result = { locked: lockedSamples.length, unlocked: unlockedSamples };

    res.send(result);
  } catch (error) {
    next(error);
  }
});

// PUT /api/floppys/:id
router.put('/:id', async (req, res, next) => {
  try {
    const snapshot = db.collection('floppys');

    const queryLocked = await snapshot
      .where('floppy', '==', parseInt(`${req.params.id}`))
      .where('unlocked', '==', false)
      .get();

    const lockedSamples = [];
    queryLocked.forEach((doc) => {
      lockedSamples.push(doc.id);
    });

    if (lockedSamples.length) {
      await snapshot.doc(lockedSamples[0]).update({ unlocked: true });
    }

    const queryUnlocked = await snapshot
      .where('floppy', '==', parseInt(`${req.params.id}`))
      .where('unlocked', '==', true)
      .get();

    const unlockedSamples = [];
    queryUnlocked.forEach((doc) => {
      unlockedSamples.push(doc.data());
    });

    const lockedSamplesCount = lockedSamples.length
      ? lockedSamples.length - 1
      : 0;

    const result = { locked: lockedSamplesCount, unlocked: unlockedSamples };

    res.send(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
