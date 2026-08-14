const dotenv = require("dotenv");
const app = require("./app");
const connectDB = require("./config/db");

dotenv.config({path: ".env.development"});

const PORT = process.env.PORT || 5000;

// Database Connection
connectDB();

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});