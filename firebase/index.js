const { initializeApp, applicationDefault } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const dotenv = require('dotenv').config();
initializeApp({
  credential: applicationDefault(),
});
const db = getFirestore();

module.exports = { db };
