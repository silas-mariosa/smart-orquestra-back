import { Elysia } from "elysia";
import { db } from "./db/drizzle-client";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { JWT } from "./jwt";
import { auth } from "./resources/auth/route";
import { usuario } from "./resources/usuario/route";

const port = process.env.PORT || 4000;

export const app = new Elysia()
  .use(
    cors({
      methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  )
  .use(JWT)
  .use(auth)
  .use(usuario)
  .listen(port);

export type App = typeof app;

if (process.env.NODE_ENV !== "production") {
  app.use(
    swagger({
      documentation: {
        tags: [
          { name: "Test", description: "Test endpoints" },
          { name: "Auth", description: "Authentication endpoints" },
        ],
      },
    })
  );
}

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
