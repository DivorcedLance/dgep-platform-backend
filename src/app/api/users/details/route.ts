import { getUserDetails } from "@/lib/db/user"
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const users = await getUserDetails()
    return NextResponse.json(users, { status: 200 })
  } catch (error) {
    console.error('GET /api/users error:', error)
    return new NextResponse('Error fetching users', { status: 500 })
  }
}