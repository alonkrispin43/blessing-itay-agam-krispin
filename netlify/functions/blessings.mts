import type { Config } from '@netlify/functions'
import { desc } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '../../db/index.js'
import { blessings } from '../../db/schema.js'

const blessingSchema = z.object({
  child: z.enum(['itai', 'agam']),
  guestName: z.string().trim().min(1).max(80),
  message: z.string().trim().min(1).max(500),
})

export default async function handler(request: Request) {
  if (request.method === 'POST') {
    const parsed = blessingSchema.safeParse(await request.json().catch(() => null))
    if (!parsed.success) {
      return Response.json({ error: 'Invalid blessing' }, { status: 400 })
    }

    const [created] = await db.insert(blessings).values(parsed.data).returning()
    return Response.json({ blessing: created }, { status: 201 })
  }

  if (request.method === 'GET') {
    const configuredPin = Netlify.env.get('ADMIN_PIN')
    if (!configuredPin) {
      return Response.json({ error: 'Admin access is not configured' }, { status: 503 })
    }
    if (request.headers.get('x-admin-pin') !== configuredPin) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const allBlessings = await db.select().from(blessings).orderBy(desc(blessings.createdAt))
    return Response.json(
      { blessings: allBlessings },
      { headers: { 'cache-control': 'no-store' } },
    )
  }

  return new Response('Method not allowed', { status: 405 })
}

export const config: Config = {
  path: '/api/blessings',
  method: ['GET', 'POST'],
}
