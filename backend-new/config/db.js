const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        if (mongoose.connection.readyState === 1) {
            return;
        }

        await mongoose.connect(process.env.MONGODB_URI);

        console.log("✅ MongoDB Connected");
    } catch (error) {
        console.error("❌ Database Connection Failed:", error.message);
        throw error;
    }
};

module.exports = connectDB;