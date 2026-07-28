import { pgTable, uuid, text, timestamp, integer, boolean, json, unique } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";

// Escritório/tenant. Um SaaS fechado multi-escritório: cada advogado opera
// isolado dos demais via organization_id + RLS (ver docs/plano-desenvolvimento.md).
export const organizations = pgTable("organizations", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  logoUrl: text("logo_url"),
  primaryColor: text("primary_color"),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id),
  email: text("email").notNull(),
  name: text("name").notNull(),
  phone: text("phone"),
  cpf: text("cpf"),
  role: text("role").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const processTypes = pgTable("process_types", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id),
  name: text("name").notNull(),
  description: text("description"),
  estimatedDurationDays: integer("estimated_duration_days"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const processes = pgTable("processes", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id),
  processNumber: text("process_number").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").notNull().default("pendente"),
  progress: integer("progress").default(0),
  clientId: uuid("client_id").notNull().references(() => profiles.id),
  processTypeId: uuid("process_type_id").notNull().references(() => processTypes.id),
  deadline: timestamp("deadline"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => [
  unique("processes_org_process_number").on(table.organizationId, table.processNumber),
]);

export const processSteps = pgTable("process_steps", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id),
  processId: uuid("process_id").notNull().references(() => processes.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  orderNumber: integer("order_number").notNull(),
  status: text("status").notNull().default("pending"),
  deadline: timestamp("deadline"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const processDocuments = pgTable("process_documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id),
  processId: uuid("process_id").notNull().references(() => processes.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  fileUrl: text("file_url").notNull(),
  fileType: text("file_type"),
  fileSize: integer("file_size"),
  status: text("status").notNull().default("pendente"),
  uploadedBy: uuid("uploaded_by").notNull().references(() => profiles.id),
  reviewedBy: uuid("reviewed_by").references(() => profiles.id),
  reviewNotes: text("review_notes"),
  reviewedAt: timestamp("reviewed_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const processMessages = pgTable("process_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id),
  processId: uuid("process_id").notNull().references(() => processes.id, { onDelete: "cascade" }),
  senderId: uuid("sender_id").notNull().references(() => profiles.id),
  message: text("message").notNull(),
  messageType: text("message_type"),
  attachmentUrl: text("attachment_url"),
  attachmentName: text("attachment_name"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id),
  userId: uuid("user_id").notNull().references(() => profiles.id),
  processId: uuid("process_id").references(() => processes.id),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull(),
  priority: text("priority"),
  isRead: boolean("is_read").default(false),
  actionUrl: text("action_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id),
  adminId: uuid("admin_id").notNull().references(() => profiles.id),
  action: text("action").notNull(),
  targetType: text("target_type").notNull(),
  targetId: uuid("target_id"),
  targetName: text("target_name"),
  details: json("details"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const documentAuditLogs = pgTable("document_audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id),
  documentId: uuid("document_id").notNull().references(() => processDocuments.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => profiles.id),
  action: text("action").notNull(),
  previousStatus: text("previous_status"),
  newStatus: text("new_status").notNull(),
  observation: text("observation"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const processFeedback = pgTable("process_feedback", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id),
  processId: uuid("process_id").notNull().references(() => processes.id),
  userId: uuid("user_id").notNull().references(() => profiles.id),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const processCounter = pgTable("process_counter", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id),
  yearMonth: text("year_month").notNull(),
  counter: integer("counter").default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => [
  unique("process_counter_org_year_month").on(table.organizationId, table.yearMonth),
]);

export const cmsContents = pgTable("cms_contents", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id),
  tipo: text("tipo").notNull(),
  titulo: text("titulo").notNull(),
  conteudo: text("conteudo").notNull(),
  editor: text("editor"),
  dataUltimaEdicao: timestamp("data_ultima_edicao").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const systemSettings = pgTable("system_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  key: text("key").notNull().unique(),
  value: text("value"),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Relations
export const organizationsRelations = relations(organizations, ({ many }) => ({
  profiles: many(profiles),
  processTypes: many(processTypes),
  processes: many(processes),
}));

export const profilesRelations = relations(profiles, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [profiles.organizationId],
    references: [organizations.id],
  }),
  processesAsClient: many(processes),
  uploadedDocuments: many(processDocuments),
  reviewedDocuments: many(processDocuments),
  sentMessages: many(processMessages),
  notifications: many(notifications),
  auditLogs: many(auditLogs),
  documentAuditLogs: many(documentAuditLogs),
  feedback: many(processFeedback),
}));

export const processTypesRelations = relations(processTypes, ({ many }) => ({
  processes: many(processes),
}));

export const processesRelations = relations(processes, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [processes.organizationId],
    references: [organizations.id],
  }),
  client: one(profiles, {
    fields: [processes.clientId],
    references: [profiles.id],
  }),
  processType: one(processTypes, {
    fields: [processes.processTypeId],
    references: [processTypes.id],
  }),
  steps: many(processSteps),
  documents: many(processDocuments),
  messages: many(processMessages),
  notifications: many(notifications),
  feedback: many(processFeedback),
}));

export const processStepsRelations = relations(processSteps, ({ one }) => ({
  process: one(processes, {
    fields: [processSteps.processId],
    references: [processes.id],
  }),
}));

export const processDocumentsRelations = relations(processDocuments, ({ one, many }) => ({
  process: one(processes, {
    fields: [processDocuments.processId],
    references: [processes.id],
  }),
  uploader: one(profiles, {
    fields: [processDocuments.uploadedBy],
    references: [profiles.id],
  }),
  reviewer: one(profiles, {
    fields: [processDocuments.reviewedBy],
    references: [profiles.id],
  }),
  auditLogs: many(documentAuditLogs),
}));

export const processMessagesRelations = relations(processMessages, ({ one }) => ({
  process: one(processes, {
    fields: [processMessages.processId],
    references: [processes.id],
  }),
  sender: one(profiles, {
    fields: [processMessages.senderId],
    references: [profiles.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(profiles, {
    fields: [notifications.userId],
    references: [profiles.id],
  }),
  process: one(processes, {
    fields: [notifications.processId],
    references: [processes.id],
  }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  admin: one(profiles, {
    fields: [auditLogs.adminId],
    references: [profiles.id],
  }),
}));

export const documentAuditLogsRelations = relations(documentAuditLogs, ({ one }) => ({
  document: one(processDocuments, {
    fields: [documentAuditLogs.documentId],
    references: [processDocuments.id],
  }),
  user: one(profiles, {
    fields: [documentAuditLogs.userId],
    references: [profiles.id],
  }),
}));

export const processFeedbackRelations = relations(processFeedback, ({ one }) => ({
  process: one(processes, {
    fields: [processFeedback.processId],
    references: [processes.id],
  }),
  user: one(profiles, {
    fields: [processFeedback.userId],
    references: [profiles.id],
  }),
}));

// Insert schemas
export const insertOrganizationSchema = createInsertSchema(organizations).omit({ id: true, createdAt: true });
export const insertProfileSchema = createInsertSchema(profiles).omit({ createdAt: true, updatedAt: true });
export const insertProcessTypeSchema = createInsertSchema(processTypes).omit({ id: true, createdAt: true });
export const insertProcessSchema = createInsertSchema(processes).omit({ id: true, createdAt: true, updatedAt: true });
export const insertProcessStepSchema = createInsertSchema(processSteps).omit({ id: true, createdAt: true, updatedAt: true });
export const insertProcessDocumentSchema = createInsertSchema(processDocuments).omit({ id: true, createdAt: true });
export const insertProcessMessageSchema = createInsertSchema(processMessages).omit({ id: true, createdAt: true });
export const insertNotificationSchema = createInsertSchema(notifications).omit({ id: true, createdAt: true });
export const insertAuditLogSchema = createInsertSchema(auditLogs).omit({ id: true, createdAt: true });
export const insertDocumentAuditLogSchema = createInsertSchema(documentAuditLogs).omit({ id: true, createdAt: true });
export const insertProcessFeedbackSchema = createInsertSchema(processFeedback).omit({ id: true, createdAt: true });
export const insertProcessCounterSchema = createInsertSchema(processCounter).omit({ id: true, createdAt: true, updatedAt: true });
export const insertCmsContentSchema = createInsertSchema(cmsContents).omit({ id: true, createdAt: true, dataUltimaEdicao: true });
export const insertSystemSettingSchema = createInsertSchema(systemSettings).omit({ id: true, createdAt: true, updatedAt: true });

// Types - using Drizzle's $inferSelect and $inferInsert for better compatibility
export type Organization = typeof organizations.$inferSelect;
export type InsertOrganization = typeof organizations.$inferInsert;

export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = typeof profiles.$inferInsert;

export type ProcessType = typeof processTypes.$inferSelect;
export type InsertProcessType = typeof processTypes.$inferInsert;

export type Process = typeof processes.$inferSelect;
export type InsertProcess = typeof processes.$inferInsert;

export type ProcessStep = typeof processSteps.$inferSelect;
export type InsertProcessStep = typeof processSteps.$inferInsert;

export type ProcessDocument = typeof processDocuments.$inferSelect;
export type InsertProcessDocument = typeof processDocuments.$inferInsert;

export type ProcessMessage = typeof processMessages.$inferSelect;
export type InsertProcessMessage = typeof processMessages.$inferInsert;

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = typeof auditLogs.$inferInsert;

export type DocumentAuditLog = typeof documentAuditLogs.$inferSelect;
export type InsertDocumentAuditLog = typeof documentAuditLogs.$inferInsert;

export type ProcessFeedback = typeof processFeedback.$inferSelect;
export type InsertProcessFeedback = typeof processFeedback.$inferInsert;

export type ProcessCounter = typeof processCounter.$inferSelect;
export type InsertProcessCounter = typeof processCounter.$inferInsert;

export type CmsContent = typeof cmsContents.$inferSelect;
export type InsertCmsContent = typeof cmsContents.$inferInsert;

export type SystemSetting = typeof systemSettings.$inferSelect;
export type InsertSystemSetting = typeof systemSettings.$inferInsert;
