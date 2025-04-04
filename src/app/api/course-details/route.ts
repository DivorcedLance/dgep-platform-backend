import { getCourseDetails } from '@/lib/db/course'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const courses = await getCourseDetails()
    return NextResponse.json(courses, { status: 200 })
  } catch (error) {
    console.error('GET /api/courses error:', error)
    return new NextResponse('Error fetching courses', { status: 500 })
  }
}