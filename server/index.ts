import express, { type Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || "5000", 10);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Add CORS middleware for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Import and register API routes
import {  registerRoutes } from "./routes";
registerRoutes(app);

// Setup Vite or static files serving
if (process.env.NODE_ENV === "production") {
  const distPath = path.resolve(__dirname, "../dist");
  const indexPath = path.join(distPath, "index.html");

  app.use(express.static(distPath));
  app.get("/{*splat}", (_req, res) => {
    res.sendFile(indexPath);
  });
} else {
  // Development mode with Vite dev server
  const vite = await createViteServer({
    server: { 
      middlewareMode: true,
      hmr: true,
    },
    appType: "spa",
  });

  app.use(vite.middlewares);
}

// Error handling
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || "Internal server error" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
