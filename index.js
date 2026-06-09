const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Kshitiz Kumar Bot is running!");
});

app.post("/message", (req, res) => {
  const message = req.body.message || "";

  let reply = "Namaste! Main Kshitiz Kumar Bot hoon.";

  if (message.toLowerCase() === "hello") {
    reply = "Hello! Kaise ho?";
  }

  res.json({ reply });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});