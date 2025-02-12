import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env" });

console.log(process.env.TURSO_CONNECTION_URL);

if (!process.env.TURSO_CONNECTION_URL || !process.env.TURSO_AUTH_TOKEN) {
  throw new Error(
    "As variáveis de ambiente TURSO_CONNECTION_URL e TURSO_AUTH_TOKEN devem estar definidas."
  );
}

export default defineConfig({
  out: "./migrations",
  schema: "./src/db/schema.ts",
  dialect: "turso",
  dbCredentials: {
    url: process.env.TURSO_CONNECTION_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
});
