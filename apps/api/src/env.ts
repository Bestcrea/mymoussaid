import { loadEnvFile } from "node:process";

try {
  loadEnvFile(".env");
} catch {
  /* .env absent en production */
}
