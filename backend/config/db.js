const mongoose = require('mongoose');
const dns = require('dns');

const connectDB = async () => {
  try {
    // Configure Google DNS servers to ensure Atlas queries resolve on Windows systems
    try {
      dns.setServers(['8.8.8.8', '8.8.4.4']);
      console.log('DNS configured to use Google DNS fallback');
    } catch (dnsErr) {
      console.warn('DNS server fallback configuration failed:', dnsErr.message);
    }

    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    console.warn(`Tip: If this is an IP whitelist issue, add your IP (or 0.0.0.0/0) in the MongoDB Atlas Network Access dashboard.`);
  }
};

module.exports = connectDB;
