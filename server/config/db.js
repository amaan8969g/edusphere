const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'MONGODB_URI=mongodb+srv://amaan:amaan858180@cluster0.hvcfmay.mongodb.net/edusphere?retryWrites=true&w=majority&appName=Cluster0');
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[Database Error] ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
