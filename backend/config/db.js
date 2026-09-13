const mongoose = require('mongoose');
const dns = require('dns');

const connectDB = async () => {
  try {
    // Only apply Google DNS override on Windows machines (where local DNS can fail SRV queries)
    // Cloud environments like Render (Linux) must use their container's default DNS
    if (process.platform === 'win32') {
      try {
        dns.setServers(['8.8.8.8', '8.8.4.4']);
        console.log('Windows: DNS configured to use Google DNS fallback');
      } catch (dnsErr) {
        console.warn('DNS server fallback configuration failed:', dnsErr.message);
      }
    }

    const rawUri = process.env.MONGO_URI;
    if (!rawUri) {
      console.error('ERROR: MONGO_URI is not defined in environment variables!');
      return;
    }

    // Clean URI in case quotes were accidentally included in cloud dashboard
    const uri = rawUri.trim().replace(/^["']|["']$/g, '');

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000,
    });
    console.log(`MongoDB Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
  }
};

module.exports = connectDB;
