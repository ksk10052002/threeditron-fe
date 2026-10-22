import Razorpay from 'razorpay';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { amount } = await request.json(); // amount in INR subunits (e.g., 5000 for ₹50)
  const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || '',
    key_secret: process.env.RAZORPAY_KEY_SECRET || ''
  });

  try {
    const options = {
      amount: amount, // amount in paisa
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1
    };
    const order = await instance.orders.create(options);
    return NextResponse.json({ orderId: order.id, keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
