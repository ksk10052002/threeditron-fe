// file: razorpay.d.ts
declare module "razorpay" {
    interface RazorpayInstance {
        orders: {
            create(options: {
                amount: number;          // amount in paise
                currency: string;        // e.g., "INR"
                receipt: string;
                payment_capture: number; // 1 = automatic capture
            }): Promise<{
                id: string;
                amount: number;
                currency: string;
                receipt: string;
                status: string;
                // other fields are optional for our use case
            }>;
        };
    }

    interface RazorpayConfig {
        key_id: string;
        key_secret: string;
    }

    class Razorpay {
        constructor(config: RazorpayConfig);
        orders: RazorpayInstance["orders"];
    }

    export = Razorpay;
}
