import { createClient } from '@libsql/client'

export const db = createClient({
  url: process.env.TURSO_DB_LINK!,
  authToken: process.env.TURSO_DB_TOKEN,
})
