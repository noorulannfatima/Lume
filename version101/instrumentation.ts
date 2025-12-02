export async function register() {
  // Override console.warn to filter out Kinde organization warnings
  const originalWarn = console.warn;
  console.warn = (...args: any[]) => {
    const message = args.join(' ');
    // Suppress Kinde SDK warnings about organizations not in ID token
    if (message.includes('organizations are not in ID token')) {
      return;
    }
    originalWarn.apply(console, args);
  };

  // Conditionally import if facing runtime compatibility issues
  // if (process.env.NEXT_RUNTIME === "nodejs") {
  await import('@/lib/orpc.server')
  // }
}