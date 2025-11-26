import { defineConfig } from "@prisma/config";

export default defineConfig({
  datasource: {
    db: {
      adapter: "sqlite",
      url: process.env.DATABASE_URL,
    },
  },
});