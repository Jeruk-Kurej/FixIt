import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary if environment variables are available
const isCloudinaryConfigured = 
  !!process.env.CLOUDINARY_CLOUD_NAME && 
  !!process.env.CLOUDINARY_API_KEY && 
  !!process.env.CLOUDINARY_API_SECRET;

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// Helper to stream upload buffer to Cloudinary
const uploadToCloudinary = (buffer: Buffer, filename: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "fixit_payments",
        public_id: filename.split(".")[0],
        resource_type: "auto",
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Clean up filename for storage/cloud usage
    const cleanFilename = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;

    if (isCloudinaryConfigured) {
      console.log("Cloudinary detected. Uploading to Cloudinary...");
      try {
        const uploadResult = await uploadToCloudinary(buffer, cleanFilename);
        return NextResponse.json({
          success: true,
          url: uploadResult.secure_url,
        });
      } catch (cloudErr: any) {
        console.error("Cloudinary upload failed:", cloudErr);
        return NextResponse.json({ 
          error: `Gagal upload ke Cloudinary: ${cloudErr.message || cloudErr}` 
        }, { status: 500 });
      }
    }

    // If running on Vercel but Cloudinary is not configured, throw a clear error
    if (process.env.VERCEL === "1") {
      return NextResponse.json({ 
        error: "Cloudinary belum dikonfigurasi di Vercel. Silakan isi CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, dan CLOUDINARY_API_SECRET di Settings Vercel Anda." 
      }, { status: 400 });
    }

    // LOCAL FALLBACK (Only for development, will fail on Vercel if folder is read-only)
    console.log("Cloudinary not configured or failed. Falling back to local storage...");
    const uploadDir = path.join(process.cwd(), "public/uploads");
    
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (err) {
      // Directory might already exist
    }

    const filePath = path.join(uploadDir, cleanFilename);
    await writeFile(filePath, buffer);
    const publicUrl = `/uploads/${cleanFilename}`;

    return NextResponse.json({ 
      success: true, 
      url: publicUrl 
    });
  } catch (err) {
    console.error("Upload Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
