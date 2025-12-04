import 'server-only'

import { createRouterClient } from '@orpc/server'
import { router } from '../app/router'
import { headers } from 'next/headers'
import { getServerSession } from 'next-auth'
import { authOptions } from './auth'

export const client = createRouterClient(router, {
  /** 
   * Provide initial context if needed.
   *
   * Because this client instance is shared across all requests,
   * only include context that's safe to reuse globally.
   * For per-request context, use middleware context or pass a function as the initial context.
   */
  context: async () => {
    const session = await getServerSession(authOptions)

    return {
      session,
      headers: await headers(), // provide headers if initial context required
    }
  },
})

globalThis.$client = client