import { waitlist, type InsertWaitlist, type WaitlistEntry } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  createWaitlistEntry(entry: InsertWaitlist): Promise<WaitlistEntry>;
  getWaitlistEntryByEmail(email: string): Promise<WaitlistEntry | undefined>;
}

export class DatabaseStorage implements IStorage {
  async createWaitlistEntry(entry: InsertWaitlist): Promise<WaitlistEntry> {
    if (!db) throw new Error("Database not available");
    const [newEntry] = await db.insert(waitlist).values(entry).returning();
    return newEntry;
  }

  async getWaitlistEntryByEmail(email: string): Promise<WaitlistEntry | undefined> {
    if (!db) throw new Error("Database not available");
    const [entry] = await db.select().from(waitlist).where(eq(waitlist.email, email));
    return entry;
  }
}

export class MemStorage implements IStorage {
  private waitlist: Map<number, WaitlistEntry>;
  private currentId: number;

  constructor() {
    this.waitlist = new Map();
    this.currentId = 1;
  }

  async createWaitlistEntry(entry: InsertWaitlist): Promise<WaitlistEntry> {
    const id = this.currentId++;
    const newEntry: WaitlistEntry = {
      id,
      email: entry.email,
      createdAt: new Date(),
    };
    this.waitlist.set(id, newEntry);
    return newEntry;
  }

  async getWaitlistEntryByEmail(email: string): Promise<WaitlistEntry | undefined> {
    return Array.from(this.waitlist.values()).find(
      (entry) => entry.email === email,
    );
  }
}

export const storage = db ? new DatabaseStorage() : new MemStorage();
