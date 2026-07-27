import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

// Initialize the B2 S3 Client
const s3 = new S3Client({
    endpoint: process.env.B2_ENDPOINT,
    credentials: {
        accessKeyId: process.env.B2_KEY_ID,
        secretAccessKey: process.env.B2_APPLICATION_KEY,
    },
    region: "us-east-005", // Set to your bucket's actual region prefix
});

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file");

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // Convert file to an array buffer and then a buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Set up upload parameters
        const uploadParams = {
            Bucket: process.env.B2_BUCKET_NAME,
            Key: `${Date.now()}-${file.name}`, // Unique filename
            Body: buffer,
            ContentType: file.type,
        };

        // Send the file to Backblaze B2
        response = await s3.send(new PutObjectCommand(uploadParams));
        console.log(response);
        return NextResponse.json({ success: true, message: "Uploaded successfully" });
    } catch (error) {
        console.error("B2 Upload Error:", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
