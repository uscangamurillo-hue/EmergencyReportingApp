import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

app.use('*', logger(console.log));
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

app.get("/make-server-32e3528b/health", (c) => {
  return c.json({ status: "ok" });
});

// ── User profile ─────────────────────────────────────────────────────────────

app.get("/make-server-32e3528b/users/:phone/profile", async (c) => {
  const phone = c.req.param("phone");
  const profile = await kv.get(`user:profile:${phone}`);
  if (!profile) return c.json({ error: "not_found" }, 404);
  return c.json(profile);
});

app.put("/make-server-32e3528b/users/:phone/profile", async (c) => {
  const phone = c.req.param("phone");
  const body = await c.req.json();
  await kv.set(`user:profile:${phone}`, { ...body, phone });
  return c.json({ ok: true });
});

// ── Emergency reports ────────────────────────────────────────────────────────

app.get("/make-server-32e3528b/users/:phone/reports", async (c) => {
  const phone = c.req.param("phone");
  const reports = await kv.get(`user:reports:${phone}`);
  return c.json(reports ?? []);
});

app.post("/make-server-32e3528b/users/:phone/reports", async (c) => {
  const phone = c.req.param("phone");
  const report = await c.req.json();
  const existing: any[] = (await kv.get(`user:reports:${phone}`)) ?? [];
  const updated = [report, ...existing];
  await kv.set(`user:reports:${phone}`, updated);
  return c.json({ ok: true });
});

// Bulk replace all reports (for sync)
app.put("/make-server-32e3528b/users/:phone/reports", async (c) => {
  const phone = c.req.param("phone");
  const reports = await c.req.json();
  await kv.set(`user:reports:${phone}`, reports);
  return c.json({ ok: true });
});

Deno.serve(app.fetch);
