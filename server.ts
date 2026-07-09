import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Use body parser middleware to support base64 store image uploads
  app.use(express.json({ limit: "20mb" }));
  app.use(express.urlencoded({ limit: "20mb", extended: true }));

  // API Endpoints
  app.get("/api/data", (req, res) => {
    try {
      const dataPath = path.join(process.cwd(), "data-store.json");
      if (fs.existsSync(dataPath)) {
        const raw = fs.readFileSync(dataPath, "utf-8");
        return res.json(JSON.parse(raw));
      }
      res.status(404).json({ error: "Data store file not found" });
    } catch (e) {
      console.error("Error reading database:", e);
      res.status(500).json({ error: "Failed to load database content" });
    }
  });

  app.post("/api/data", (req, res) => {
    try {
      const dataPath = path.join(process.cwd(), "data-store.json");
      const { cases, inquiries, hardware } = req.body;
      
      if (!cases || !inquiries || !hardware) {
        return res.status(400).json({ error: "Missing required fields: cases, inquiries, and hardware must all be provided." });
      }

      const raw = JSON.stringify({ cases, inquiries, hardware }, null, 2);
      fs.writeFileSync(dataPath, raw, "utf-8");
      res.json({ success: true, message: "Database successfully written to server." });
    } catch (e) {
      console.error("Error writing database:", e);
      res.status(500).json({ error: "Failed to persist database content on server" });
    }
  });

  // Vite middleware for development or static file serving for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // Support Express v4 / v5 SPA routing routing
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
