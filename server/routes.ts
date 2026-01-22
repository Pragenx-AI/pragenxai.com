import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.post(api.waitlist.create.path, async (req, res) => {
    try {
      const input = api.waitlist.create.input.parse(req.body);
      
      const existing = await storage.getWaitlistEntryByEmail(input.email);
      if (existing) {
        return res.status(409).json({ message: "Email already on waitlist" });
      }

      const entry = await storage.createWaitlistEntry(input);

      // Log email to "pragennxai@gmail.com" as requested
      console.log(`[EMAIL SEND] To: pragennxai@gmail.com | New waitlist signup: ${input.email}`);
      
      res.status(201).json(entry);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  return httpServer;
}
