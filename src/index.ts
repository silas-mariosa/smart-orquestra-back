import { Elysia } from "elysia";
import { db } from "./db/drizzle-client";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { JWT } from "./jwt";
import { auth } from "./resources/auth/route";
import { usuario } from "./resources/usuario/route";
import { instrumentos } from "./resources/intrumentos/route";
import { categorias } from "./resources/categorias/route";
import { louvores } from "./resources/louvores/route";
import { grupos } from "./resources/grupos/route";
import { grupoLista } from "./resources/grupo-lista/route";
import { instrumentosList } from "./resources/instrumentos-lista/route";
import { dashboard } from "./resources/dashboard/route";
import { ensaios } from "./resources/ensaios/route";

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
  .use(instrumentos)
  .use(categorias)
  .use(louvores)
  .use(grupos)
  .use(grupoLista)
  .use(instrumentosList)
  .use(dashboard)
  .use(ensaios)
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
