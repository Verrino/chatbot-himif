const express = require("express");
const fs = require("fs").promises;
const cors = require("cors");

const app = express();
const port = 3001;

app.use(cors());

app.get("/api/information", async (req, res) => {
  try {
    const information = await fs.readFile("information.txt", "utf-8");
    res.json({ information });
  } catch (error) {
    console.error("Error reading file:", error);
    res.status(500).json({ error: "Failed to read file" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
