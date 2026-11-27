import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { catalogRequest } from "@/lib/catalog";

export async function POST(request) {
  if (!(await isAdmin(request.headers.get("cookie")))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const response = await catalogRequest("/admin/uploads", {
      method: "POST",
      body: await request.formData(),
    });
    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
      throw new Error(
        `Catalog Worker returned HTTP ${response.status} instead of JSON. Deploy the updated catalog-worker.js before uploading images.`,
      );
    }
    const payload = await response.json();
    return NextResponse.json(payload, { status: response.status });
  } catch (error) {
    console.error("Catalog image upload error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Image upload failed." },
      { status: 502 },
    );
  }
}
