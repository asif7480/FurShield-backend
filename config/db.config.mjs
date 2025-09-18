// import mongoose from 'mongoose';

// const connectDB = async() => {
//     try{
//         const conn = await mongoose.connect(process.env.MONGO_URI)
//         console.log(`Connected to: ${conn.connection.host}`);
//     }catch(err){
//         console.log(`Error: ${err.message}`)
//     }
// }

// export default connectDB

import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("Please define the MONGO_URI environment variable");
}

// Cache the connection across function calls (important in serverless)
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn; // Use existing connection if available
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      bufferCommands: false,  // Disable mongoose buffering — helpful for error visibility
    }).then((mongoose) => {
      console.log(`Connected to MongoDB: ${mongoose.connection.host}`);
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;