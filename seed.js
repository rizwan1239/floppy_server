const { readdir } = require('fs');
const { red, green } = require('chalk');
const Moralis = require('moralis/node');
const dotenv = require('dotenv').config();
const serverUrl = process.env.TEST_SERVER_URL;
const appId = process.env.TEST_APP_ID;
const masterKey = process.env.TEST_MASTER_KEY;

const seed = async () => {
  try {
    Moralis.start({ serverUrl, appId, masterKey });

    const audioBaseURL =
      'https://gateway.pinata.cloud/ipfs/QmSs8VAXeGHJpZAp5eUfMGn3xYUMNeKSwuKt8wB3My9BKN';
    const imageBaseURL =
      'https://gateway.pinata.cloud/ipfs/QmNgEcokwRpBbf8KRqHRkdBa7fmZZfBofqg9hX2Hpa1vx6';

    const samples = [];
    const waveforms = [];
    readdir(
      '/Users/gabrielgutierrez/Documents/floppy/SAMPLES',
      (err, files) => {
        if (err) console.log(err);
        for (const file of files) {
          samples.push(file);
        }
      }
    );
    readdir('/Users/gabrielgutierrez/Documents/floppy/PICS', (err, files) => {
      if (err) console.log(err);
      for (const file of files) {
        waveforms.push(file);
      }
    });

    const range = (start, stop, step) =>
      Array.from(
        { length: (stop - start) / step + 1 },
        (_, i) => start + i * step
      );

    const randomIndex = (value) => Math.floor(Math.random() * value);

    const bpms = range(140, 180, 5);
    const playTypes = ['loop', 'one-shot'];
    const unlockedOptions = [true, false];
    const floppys = [0, 1, 2];
    const sampleNames = [];

    setTimeout(() => {
      samples.forEach((sample) => {
        sampleNames.push(sample.split('.')[0]);
      });
      for (let i = 0; i < sampleNames.length; i++) {
        const file = new Moralis.Object('Sample');

        file.set('name', sampleNames[i]);
        file.set('bpm', bpms[randomIndex(bpms.length)]);
        file.set('playType', playTypes[randomIndex(2)]);
        file.set('unlocked', unlockedOptions[randomIndex(2)]);
        file.set('floppy', floppys[randomIndex(3)]);
        file.set('audioUrl', `${audioBaseURL}/${samples[i]}`);
        file.set('waveform', `${imageBaseURL}/${waveforms[i]}`);
        file.save();
      }

      console.log(green('seeded samples'));
    }, 100);
  } catch (error) {
    console.log(red(error));
  }
};

if (require.main === module) {
  seed()
    .then(() => {
      console.log(green('Seeding success!'));
    })
    .catch((err) => {
      console.error(red('Something went wrong!'));
      console.error(err);
    });
}
