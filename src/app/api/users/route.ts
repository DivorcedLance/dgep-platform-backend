import { getUser, createUser, updateUser } from '@/lib/db/user'
import { UserCreate } from '@/lib/db/types/user'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (id) {
      const users = await getUser()
      const user = users.find(user => user.id === Number(id))
      if (!user) {
        return new NextResponse('User not found', { status: 404 })
      }
      return NextResponse.json(user, { status: 200 })
    }

    const users = await getUser()
    return NextResponse.json(users, { status: 200 })
  } catch (error) {
    console.error('GET /api/users error:', error)
    return new NextResponse('Error fetching users', { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const userData: UserCreate = body
    const newUser = await createUser(userData)
    return NextResponse.json(newUser, { status: 201 })
  } catch (error) {
    console.error('POST /api/users error:', error)
    return new NextResponse('Error creating user', { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const userData: {
      id: number,
      userUpdate: Partial<UserCreate>
    } = body
    const updatedUser = await updateUser(userData.id, userData.userUpdate)
    return NextResponse.json(updatedUser, { status: 200 })
  } catch (error) {
    console.error('PUT /api/users error:', error)
    return new NextResponse('Error updating user', { status: 500 })
  }
}