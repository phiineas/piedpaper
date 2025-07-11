import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";

// Load environment variables from .env.local
config({ path: ".env.local" });

if (!process.env.POSTGRES_URL) {
  throw new Error("POSTGRES_URL is not set in .env.local file");
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/lib/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.POSTGRES_URL,
  },
  verbose: true,
  strict: true,
});
