import { defineConfig } from "prisma/config";

export default defineConfig({
  datasource: {
    adapter: "sqlite",
    url: "file:./prisma/dev.db",
  },
});