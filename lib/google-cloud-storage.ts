import { v4 as uuidv4 } from 'uuid'

// Helper function to get access token
async function getAccessToken(): Promise<string> {
  const tokenUrl = 'https://oauth2.googleapis.com/token'
  const scope = 'https://www.googleapis.com/auth/devstorage.full_control'
  
  // Create JWT assertion
  const now = Math.floor(Date.now() / 1000)
  const exp = now + 3600 // Token expires in 1 hour
  
  const jwt = {
    iss: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
    scope: scope,
    aud: tokenUrl,
    exp: exp,
    iat: now,
  }

  // Sign the JWT
  const header = { alg: 'RS256', typ: 'JWT' }
  const headerBase64 = Buffer.from(JSON.stringify(header)).toString('base64url')
  const payloadBase64 = Buffer.from(JSON.stringify(jwt)).toString('base64url')
  const signature = require('crypto')
    .createSign('RSA-SHA256')
    .update(`${headerBase64}.${payloadBase64}`)
    .sign(process.env.GOOGLE_CLOUD_PRIVATE_KEY!, 'base64url')

  const assertion = `${headerBase64}.${payloadBase64}.${signature}`

  // Exchange JWT for access token
  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: assertion,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to get access token')
  }

  const data = await response.json()
  return data.access_token
}

export async function uploadToGoogleCloud(
  file: Buffer,
  originalFilename: string,
  mimeType: string
): Promise<string> {
  try {
    const filename = `menu-items/${uuidv4()}-${originalFilename}`
    const accessToken = await getAccessToken()
    
    // Upload the file without ACL
    const uploadResponse = await fetch(`https://storage.googleapis.com/upload/storage/v1/b/${process.env.GOOGLE_CLOUD_BUCKET_NAME}/o?uploadType=media&name=${filename}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': mimeType,
      },
      body: file,
    })

    if (!uploadResponse.ok) {
      const error = await uploadResponse.text()
      throw new Error(`Failed to upload file: ${error}`)
    }

    // Return the public URL
    return `https://storage.googleapis.com/${process.env.GOOGLE_CLOUD_BUCKET_NAME}/${filename}`
  } catch (error) {
    console.error('Upload error:', error)
    throw error
  }
}

export async function deleteFromGoogleCloud(fileUrl: string) {
  try {
    const filename = fileUrl.split(`${process.env.GOOGLE_CLOUD_BUCKET_NAME}/`)[1]
    const accessToken = await getAccessToken()
    
    const response = await fetch(`https://storage.googleapis.com/storage/v1/b/${process.env.GOOGLE_CLOUD_BUCKET_NAME}/o/${encodeURIComponent(filename)}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to delete file: ${error}`)
    }
  } catch (error) {
    console.error('Error deleting file from Google Cloud:', error)
    throw error
  }
} 