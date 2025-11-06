const express = require("express");
const redis = require("redis");
const items = require("./data");

const app = express();
app.use(express.json());

// Connect to Redis
const client = redis.createClient();

client.on("error", (err) => console.error("Redis Client Error:", err));
client.connect();

// GET /items → fetch all items (cached)
app.get("/items", async (req, res) => {
  try {
    const cacheKey = "items:all";

    // 1️⃣ Check cache
    const cachedData = await client.get(cacheKey);
    if (cachedData) {
      console.log("Cache hit ✅");
      return res.status(200).json(JSON.parse(cachedData));
    }

    console.log("Cache miss ❌");

    // 2️⃣ Fetch from "DB"
    const data = items;

    // 3️⃣ Store in Redis with 1 min TTL
    await client.set(cacheKey, JSON.stringify(data), { EX: 60 });
    return res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /items → add new item
app.post("/items", async (req, res) => {
  try {
    const newItem = { id: Date.now(), ...req.body };
    items.push(newItem);

    // Invalidate cache
    await client.del("items:all");
    console.log("Cache invalidated after POST 🗑️");

    res.status(201).json({ message: "Item added", data: newItem });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /items/:id → update item
app.put("/items/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const index = items.findIndex((i) => i.id === id);

    if (index === -1) return res.status(404).json({ message: "Item not found" });

    items[index] = { ...items[index], ...req.body };

    // Invalidate cache
    await client.del("items:all");
    console.log("Cache invalidated after PUT 🗑️");

    res.status(200).json({ message: "Item updated", data: items[index] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /items/:id → delete item
app.delete("/items/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const index = items.findIndex((i) => i.id === id);

    if (index === -1) return res.status(404).json({ message: "Item not found" });

    items.splice(index, 1);

    // Invalidate cache
    await client.del("items:all");
    console.log("Cache invalidated after DELETE 🗑️");

    res.status(200).json({ message: "Item deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
