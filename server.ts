import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize Firebase Firestore
  let db: any = null;
  try {
    const firebaseConfigPath = path.join(process.cwd(), "firebase-applet-config.json");
    if (fs.existsSync(firebaseConfigPath)) {
      const config = JSON.parse(fs.readFileSync(firebaseConfigPath, "utf-8"));
      const firebaseApp = initializeApp(config);
      // Connect to the specific database if firestoreDatabaseId is defined, otherwise default
      db = config.firestoreDatabaseId 
        ? getFirestore(firebaseApp, config.firestoreDatabaseId)
        : getFirestore(firebaseApp);
      console.log(`[Firebase] Firestore successfully initialized with project ID: ${config.projectId}`);
    } else {
      console.warn("[Firebase] firebase-applet-config.json not found. Database will run in local-only fallback mode.");
    }
  } catch (error) {
    console.error("[Firebase] Failed to initialize Firebase Firestore:", error);
  }

  // Use body parser middleware to support base64 store image uploads
  app.use(express.json({ limit: "20mb" }));
  app.use(express.urlencoded({ limit: "20mb", extended: true }));

  // API Endpoints
  app.get("/api/data", async (req, res) => {
    try {
      const dataPath = path.join(process.cwd(), "data-store.json");
      
      // Try retrieving from Firebase Firestore first
      if (db) {
        try {
          const docRef = doc(db, "appData", "luminous_store");
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            console.log("[Firebase] Successfully retrieved store data from Cloud Firestore.");
            const cloudData = docSnap.data();
            // Cache locally to keep data-store.json in sync
            fs.writeFileSync(dataPath, JSON.stringify(cloudData, null, 2), "utf-8");
            return res.json(cloudData);
          } else {
            console.log("[Firebase] Cloud Firestore document 'luminous_store' does not exist yet.");
          }
        } catch (fbError) {
          console.error("[Firebase] Error reading from Cloud Firestore, falling back to local file:", fbError);
        }
      }

      // Local file fallback
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

  app.post("/api/data", async (req, res) => {
    try {
      const dataPath = path.join(process.cwd(), "data-store.json");
      const { cases, inquiries, hardware } = req.body;
      
      if (!cases || !inquiries || !hardware) {
        return res.status(400).json({ error: "Missing required fields: cases, inquiries, and hardware must all be provided." });
      }

      const payload = { cases, inquiries, hardware };
      const raw = JSON.stringify(payload, null, 2);
      
      // Always write to local file as immediate server-side cache/backup
      fs.writeFileSync(dataPath, raw, "utf-8");

      // Save to Firebase Firestore
      let savedToCloud = false;
      if (db) {
        try {
          const docRef = doc(db, "appData", "luminous_store");
          await setDoc(docRef, payload);
          savedToCloud = true;
          console.log("[Firebase] Successfully persisted store data to Cloud Firestore.");
        } catch (fbError) {
          console.error("[Firebase] Failed to write data to Cloud Firestore:", fbError);
        }
      }

      res.json({ 
        success: true, 
        message: savedToCloud 
          ? "Database successfully persisted to Cloud Firestore and local server cache." 
          : "Database successfully written to local server backup, but Cloud Firestore write failed." 
      });
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
