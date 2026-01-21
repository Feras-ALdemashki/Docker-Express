import express from "express";
import "dotenv/config";
import mongoose from "mongoose";
const app = express();
const PORT = process.env.PORT;
app.use(express.json());

const mongo_db_url = process.env.mongo_db_url;

// simple schema
const itemSchema = new mongoose.Schema({
  name: string,
  created_at: Date.now,
});

const Item = mongoose.model("item", itemSchema);

//endpoint
app.get("/", (req, res) => {
  res.status(200).json({ msg: "Express + mongoDB", status: "active" });
});
app.post("/items", async (req, res) => {
  try {
    const item = new Item({ name: req.body.name });
    await item.save();
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/items", async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
async function start() {
  try {
    await mongoose.connect(mongo_db_url);
    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
}

start();
