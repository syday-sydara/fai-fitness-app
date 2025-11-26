import { defineConfig } from "@prisma/config";

export default defineConfig({
  datasource: {
    db: {
      adapter: "sqlite", // or "postgresql", "mysql"
      url: process.env.DATABASE_URL,
    },
  },
});