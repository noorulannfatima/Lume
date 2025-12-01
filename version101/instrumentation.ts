export async function register() {
  // Conditionally import if facing runtime compatibility issues
  // if (process.env.NEXT_RUNTIME === "nodejs") {
  await import("@backend/lib/orpc.server')
  // }
}