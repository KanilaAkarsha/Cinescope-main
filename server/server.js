import "dotenv/config"; // ← MUST be first line — loads .env before any imports

import app from "./app.js";
import connectDB from "./config/db.js";
import "./config/googleStrategy.js"; // now env vars are available

await connectDB();
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
