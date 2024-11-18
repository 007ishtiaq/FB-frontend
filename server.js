const express = require("express");
const path = require("path");

const app = express();

// Serve static files from the "build" directory
app.use(express.static(path.join(__dirname, "build")));

// Catch-all route for client-side routing
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Client server is running on port ${port}`);
});
