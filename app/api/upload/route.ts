import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth.config'
import { uploadToGoogleCloud } from '@/lib/google-cloud-storage'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return new NextResponse("No file provided", { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return new NextResponse("Invalid file type. Only images are allowed.", { status: 400 })
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer())
    
    // Upload to Google Cloud Storage
    const imageUrl = await uploadToGoogleCloud(buffer, file.name, file.type)
    
    return NextResponse.json({ url: imageUrl })
  } catch (error) {
    console.error('[UPLOAD_ERROR]', error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export const config = {
  api: {
    bodyParser: false, // Disable body parser for file uploads
  },
} 