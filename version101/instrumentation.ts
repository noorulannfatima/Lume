// instrumentation.ts or at the top of your database.ts
import 'dotenv/config';
export async function register() {
  // Conditionally import if facing runtime compatibility issues
  // if (process.env.NEXT_RUNTIME === "nodejs") {
  await import("@/lib/orpc.server")
  // }
}