import mongoose from 'mongoose';
import colors from 'colors';
const ConnectedDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL);
    console.log(`Connected to mongodb ${conn.connection.host}`.bgMagenta.white);
  } catch (error) {
    console.log(`Error in mongodb ${error}`.bgRed.white);
  }
};

export default ConnectedDB;
