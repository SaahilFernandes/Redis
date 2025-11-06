# 🧠 Simple Redis Caching with Invalidation

## 🎯 Objective
This project demonstrates how **Redis** can be used as a caching layer for `GET` requests in a **Node.js + Express** application.  
It also implements **cache invalidation** logic — clearing the cache automatically when the underlying data is **added, updated, or deleted**.

---

## ⚙️ Tech Stack
- **Node.js**
- **Express.js**
- **Redis** (via `redis` npm package)
- **Docker** (for running Redis locally)
- **In-memory JS array** as a mock database

---

## 🏗️ Project Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/SaahilFernandes/Redis.git
cd Redis
