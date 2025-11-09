# Vercel Blob Storage Setup Guide

## Problem
Image uploads work locally but fail in production on Vercel.

## Solution: Set Up Vercel Blob Storage

### Step 1: Create Blob Storage in Vercel

1. Go to your Vercel Dashboard: https://vercel.com/dashboard
2. Select your **qachon** project
3. Click on **Storage** tab in the left sidebar
4. Click **Create Database** button
5. Select **Blob** from the options
6. Click **Continue**
7. Give it a name (e.g., "qachon-images") or keep default
8. Click **Create**

### Step 2: Verify Environment Variable

After creating Blob storage:

1. Go to **Settings** → **Environment Variables**
2. Check if `BLOB_READ_WRITE_TOKEN` exists
3. It should be automatically added by Vercel
4. Value will look like: `vercel_blob_rw_XXXXXXXXXX`

If it doesn't exist:
1. Go back to **Storage** tab
2. Click on your Blob store
3. Copy the token from there
4. Add it manually in Settings → Environment Variables

### Step 3: Redeploy Your Project

After setting up Blob storage:

```bash
git add .
git commit -m "Add Vercel Blob error handling and logging"
git push
```

Or trigger a redeploy in Vercel dashboard:
1. Go to **Deployments** tab
2. Click the **...** menu on latest deployment
3. Click **Redeploy**

### Step 4: Test Upload in Production

1. Go to your production site
2. Try creating a restaurant with an image
3. Check Vercel logs if it fails:
   - Go to your project in Vercel
   - Click **Logs** tab
   - Look for error messages

### Troubleshooting

#### Error: "Vercel Blob storage not configured"
**Cause**: `BLOB_READ_WRITE_TOKEN` environment variable is missing

**Solution**: Follow Step 1 and Step 2 above to create Blob storage

#### Error: "Upload error" or timeout
**Cause**: File might be too large or network issue

**Solution**:
- Check file size (max 5MB)
- Check Vercel function timeout settings

#### Images not displaying after upload
**Cause**: URL might be incorrect

**Solution**: Check the URL format in logs - should be:
```
https://xxxxxx.public.blob.vercel-storage.com/restaurants/123456-image.jpg
```

### Verify It's Working

After deployment, try uploading an image. You should see in Vercel logs:
```
Production mode: Attempting Vercel Blob upload
Uploading to Vercel Blob: restaurants/1234567-image.jpg
Upload successful: https://xxxxx.public.blob.vercel-storage.com/...
```

### Storage Limits

Vercel Blob Free Tier:
- **Storage**: 500 MB
- **Bandwidth**: 500 MB/month

If you need more, consider upgrading or using Cloudinary (free tier: 25GB).
