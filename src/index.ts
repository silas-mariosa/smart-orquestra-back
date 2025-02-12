import { Elysia } from "elysia";
import { db } from "./db/drizzle-client";

db;

const app = new Elysia().get("/", () => "Hello Elysia").listen(4000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
