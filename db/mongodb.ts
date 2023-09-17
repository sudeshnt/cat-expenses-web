import mongoose from "mongoose";

export const connectToMongoDB = async () => {
  try {
    if (
      mongoose.connection.readyState !== mongoose.ConnectionStates.connected
    ) {
      await mongoose.connect(process.env.MONGODB_URI ?? "");
      console.log("Connected to MongoDB.");
    }
  } catch (error) {
    console.error(error);
  }
};
