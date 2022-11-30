const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const dotenv = require('dotenv').config();

const serviceAccount = JSON.parse(process.env.GOOGLE_CREDS);

initializeApp({
  credential: cert(serviceAccount),
});
const db = getFirestore();

module.exports = { db };
