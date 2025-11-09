import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { content } from '@/content/text.content';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: content.upload.fileNotFound },
        { status: 400 }
      );
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: content.upload.unsupportedFormat },
        { status: 400 }
      );
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: content.upload.fileTooLarge },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `restaurants/${timestamp}-${originalName}`;

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: 'public',
    });

    // Return URL
    return NextResponse.json({
      success: true,
      url: blob.url
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: content.upload.uploadError },
      { status: 500 }
    );
  }
}
