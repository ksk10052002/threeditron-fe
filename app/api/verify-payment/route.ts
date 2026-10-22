import Razorpay from "razorpay";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
        await request.json();

    // Compute expected signature
    const crypto = await import("crypto"); // native node module
    const generatedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

    if (generatedSignature !== razorpay_signature) {
        return NextResponse.json(
            { error: "Invalid payment signature" },
            { status: 400 }
        );
    }

    // TODO: Record the payment in your DB, fulfill the order, etc.
    // For demo we just return success:
    return NextResponse.json({ verified: true });
}
