export async function register() {
  try {
    await import('@/config/env/server');
    await import('@/config/env/public.server');
  } catch (error) {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
      console.error(
        error instanceof Error
          ? error.message
          : 'Invalid environment configuration',
      );
      process.exit(1);
    }

    throw error;
  }
}
