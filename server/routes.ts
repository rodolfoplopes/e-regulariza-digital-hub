import type { Express } from "express";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";
import * as schema from "@shared/schema";

export function registerRoutes(app: Express) {
  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  // Profiles
  app.get("/api/profiles/:id", async (req, res) => {
    try {
      const [profile] = await db
        .select()
        .from(schema.profiles)
        .where(eq(schema.profiles.id, req.params.id));
      
      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }
      
      res.json(profile);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  });

  // Processes
  app.get("/api/processes", async (req, res) => {
    try {
      const clientId = req.query.clientId as string | undefined;
      
      const processes = clientId
        ? await db
            .select()
            .from(schema.processes)
            .where(eq(schema.processes.clientId, clientId))
            .orderBy(desc(schema.processes.createdAt))
        : await db
            .select()
            .from(schema.processes)
            .orderBy(desc(schema.processes.createdAt));
      
      res.json(processes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch processes" });
    }
  });

  app.get("/api/processes/:id", async (req, res) => {
    try {
      const [process] = await db
        .select()
        .from(schema.processes)
        .where(eq(schema.processes.id, req.params.id));
      
      if (!process) {
        return res.status(404).json({ error: "Process not found" });
      }
      
      res.json(process);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch process" });
    }
  });

  app.post("/api/processes", async (req, res) => {
    try {
      const validatedData = schema.insertProcessSchema.parse(req.body);
      
      const [newProcess] = await db
        .insert(schema.processes)
        .values(validatedData)
        .returning();
      
      res.status(201).json(newProcess);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to create process" });
    }
  });

  // Process Messages
  app.get("/api/processes/:processId/messages", async (req, res) => {
    try {
      const messages = await db
        .select()
        .from(schema.processMessages)
        .where(eq(schema.processMessages.processId, req.params.processId))
        .orderBy(schema.processMessages.createdAt);
      
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  app.post("/api/processes/:processId/messages", async (req, res) => {
    try {
      const validatedData = schema.insertProcessMessageSchema.parse({
        ...req.body,
        processId: req.params.processId,
      });
      
      const [newMessage] = await db
        .insert(schema.processMessages)
        .values(validatedData)
        .returning();
      
      res.status(201).json(newMessage);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to create message" });
    }
  });

  // Notifications
  app.get("/api/notifications", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      
      if (!userId) {
        return res.status(400).json({ error: "userId is required" });
      }
      
      const notifications = await db
        .select()
        .from(schema.notifications)
        .where(eq(schema.notifications.userId, userId))
        .orderBy(desc(schema.notifications.createdAt));
      
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch notifications" });
    }
  });

  app.patch("/api/notifications/:id/read", async (req, res) => {
    try {
      const [updated] = await db
        .update(schema.notifications)
        .set({ isRead: true })
        .where(eq(schema.notifications.id, req.params.id))
        .returning();
      
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Failed to mark notification as read" });
    }
  });

  // Process Documents
  app.get("/api/processes/:processId/documents", async (req, res) => {
    try {
      const documents = await db
        .select()
        .from(schema.processDocuments)
        .where(eq(schema.processDocuments.processId, req.params.processId));
      
      res.json(documents);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch documents" });
    }
  });

  app.post("/api/processes/:processId/documents", async (req, res) => {
    try {
      const validatedData = schema.insertProcessDocumentSchema.parse({
        ...req.body,
        processId: req.params.processId,
      });
      
      const [newDocument] = await db
        .insert(schema.processDocuments)
        .values(validatedData)
        .returning();
      
      res.status(201).json(newDocument);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to upload document" });
    }
  });

  // Integration endpoints (placeholders for now)
  app.post("/api/integrations/twilio/send", async (req, res) => {
    // TODO: Implement Twilio integration
    res.status(501).json({ error: "Twilio integration not yet implemented" });
  });

  app.post("/api/integrations/hubspot/sync", async (req, res) => {
    // TODO: Implement HubSpot integration
    res.status(501).json({ error: "HubSpot integration not yet implemented" });
  });

  app.post("/api/integrations/sheets/export", async (req, res) => {
    // TODO: Implement Google Sheets integration
    res.status(501).json({ error: "Google Sheets integration not yet implemented" });
  });
}
