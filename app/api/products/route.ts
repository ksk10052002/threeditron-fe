import { catalogRequest } from "@/lib/catalog";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await catalogRequest("/products");
    if (!response.ok) return NextResponse.json({ error: "Catalog unavailable." }, { status: 502 });
    return NextResponse.json(await response.json());
  } catch {
    return NextResponse.json({ error: "Catalog unavailable." }, { status: 503 });
  }
}
