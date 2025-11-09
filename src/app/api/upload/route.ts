import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { content } from '@/content/text.content';

// Check if we're on Vercel (production or preview)
const isVercel = !!process.env.VERCEL || !!process.env.BLOB_READ_WRITE_TOKEN;
const isProduction = isVercel;

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
    const filename = `${timestamp}-${originalName}`;

    let url: string;

    console.log('Environment check:', {
      isVercel,
      isProduction,
      hasToken: !!process.env.BLOB_READ_WRITE_TOKEN,
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: process.env.VERCEL
    });

    if (isProduction) {
      // Production: Use Vercel Blob
      console.log('Using Vercel Blob storage');

      // Check if token exists
      if (!process.env.BLOB_READ_WRITE_TOKEN) {
        console.error('BLOB_READ_WRITE_TOKEN not found in environment');
        return NextResponse.json(
          { error: 'Vercel Blob storage not configured. Please set up Blob storage in Vercel dashboard.' },
          { status: 500 }
        );
      }

      const blobPath = `restaurants/${filename}`;
      console.log('Uploading to Vercel Blob:', blobPath);

      const blob = await put(blobPath, file, {
        access: 'public',
      });

      console.log('Vercel Blob upload successful:', blob.url);
      url = blob.url;
    } else {
      // Development: Save to local filesystem
      console.log('Using local filesystem storage');
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Ensure upload directory exists
      const uploadDir = join(process.cwd(), 'public', 'uploads', 'restaurants');
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }

      // Save file
      const filepath = join(uploadDir, filename);
      await writeFile(filepath, buffer);

      // Return local URL
      url = `/uploads/restaurants/${filename}`;
      console.log('Local upload successful:', url);
    }

    return NextResponse.json({
      success: true,
      url
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: content.upload.uploadError },
      { status: 500 }
    );
  }
}
