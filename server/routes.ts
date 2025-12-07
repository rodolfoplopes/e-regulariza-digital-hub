import type { Express } from "express";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";
import * as schema from "@shared/schema";
import { z } from "zod";

const createProcessSchema = z.object({
  processNumber: z.string().min(1, "Número do processo é obrigatório"),
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().optional(),
  status: z.string().default("pendente"),
  progress: z.number().default(0),
  clientId: z.string().uuid("ID do cliente inválido"),
  processTypeId: z.string().uuid("ID do tipo de processo inválido"),
  deadline: z.string().optional(),
});

const createMessageSchema = z.object({
  senderId: z.string().uuid("ID do remetente inválido"),
  message: z.string().min(1, "Mensagem é obrigatória"),
  messageType: z.string().optional(),
  attachmentUrl: z.string().optional(),
  attachmentName: z.string().optional(),
});

const createDocumentSchema = z.object({
  name: z.string().min(1, "Nome do documento é obrigatório"),
  fileUrl: z.string().min(1, "URL do arquivo é obrigatória"),
  fileType: z.string().optional(),
  fileSize: z.number().optional(),
  status: z.string().default("pendente"),
  uploadedBy: z.string().uuid("ID do usuário inválido"),
  reviewedBy: z.string().uuid().optional(),
  reviewNotes: z.string().optional(),
  reviewedAt: z.string().optional(),
});

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
      const validated = createProcessSchema.parse(req.body);
      
      const processData = {
        processNumber: validated.processNumber,
        title: validated.title,
        description: validated.description,
        status: validated.status,
        progress: validated.progress,
        clientId: validated.clientId,
        processTypeId: validated.processTypeId,
        deadline: validated.deadline ? new Date(validated.deadline) : undefined,
      };
      
      const [newProcess] = await db
        .insert(schema.processes)
        .values(processData)
        .returning();
      
      res.status(201).json(newProcess);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors.map(e => e.message).join(", ") });
      }
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
      const validated = createMessageSchema.parse(req.body);
      
      const messageData = {
        processId: req.params.processId,
        senderId: validated.senderId,
        message: validated.message,
        messageType: validated.messageType,
        attachmentUrl: validated.attachmentUrl,
        attachmentName: validated.attachmentName,
      };
      
      const [newMessage] = await db
        .insert(schema.processMessages)
        .values(messageData)
        .returning();
      
      res.status(201).json(newMessage);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors.map(e => e.message).join(", ") });
      }
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
      const validated = createDocumentSchema.parse(req.body);
      
      const documentData = {
        processId: req.params.processId,
        name: validated.name,
        fileUrl: validated.fileUrl,
        fileType: validated.fileType,
        fileSize: validated.fileSize,
        status: validated.status,
        uploadedBy: validated.uploadedBy,
        reviewedBy: validated.reviewedBy,
        reviewNotes: validated.reviewNotes,
        reviewedAt: validated.reviewedAt ? new Date(validated.reviewedAt) : undefined,
      };
      
      const [newDocument] = await db
        .insert(schema.processDocuments)
        .values(documentData)
        .returning();
      
      res.status(201).json(newDocument);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors.map(e => e.message).join(", ") });
      }
      res.status(400).json({ error: error.message || "Failed to upload document" });
    }
  });

  // Integration endpoints
  app.post("/api/integrations/twilio/send", async (req, res) => {
    try {
      const { to, message } = req.body;
      if (!to || !message) {
        return res.status(400).json({ error: "Missing 'to' or 'message' in request body" });
      }
      res.json({ 
        success: true, 
        message: "SMS notification queued (Twilio integration requires API keys)" 
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to send notification" });
    }
  });

  app.post("/api/integrations/hubspot/sync", async (req, res) => {
    try {
      const processes = await db
        .select()
        .from(schema.processes)
        .orderBy(desc(schema.processes.createdAt));
      
      res.json({ 
        success: true, 
        synced: processes.length,
        message: `${processes.length} records ready for HubSpot sync (requires API key configuration)` 
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to sync with HubSpot" });
    }
  });

  app.post("/api/integrations/sheets/export", async (req, res) => {
    try {
      const processes = await db
        .select()
        .from(schema.processes)
        .orderBy(desc(schema.processes.createdAt));
      
      res.json({ 
        success: true, 
        exported: processes.length,
        data: processes,
        message: `${processes.length} processes exported successfully` 
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to export data" });
    }
  });
}
