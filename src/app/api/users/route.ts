import { db } from '@/lib/db/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const result = await db.execute('SELECT * FROM users')
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('GET /api/users error:', error)
    return new NextResponse('Error fetching users', { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const { name, email } = data

    if (!name || !email) {
      return new NextResponse('Missing name or email', { status: 400 })
    }

    await db.execute({
      sql: 'INSERT INTO users (name, email) VALUES (?, ?)',
      args: [name, email],
    })

    return new NextResponse('User created', { status: 201 })
  } catch (error) {
    console.error('POST /api/users error:', error)
    return new NextResponse('Error creating user', { status: 500 })
  }
}
