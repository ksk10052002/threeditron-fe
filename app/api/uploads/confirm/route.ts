import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Helper function to resolve material name
function getMaterialName(m: number | string): string {
  const map: Record<number | string, string> = {
    1: "PLA (₹10/g)",
    2: "ABS (₹15/g)",
    3: "TPU (₹25/g)",
    4: "PETG (₹40/g)",
    "PLA": "PLA (₹10/g)",
    "ABS": "ABS (₹15/g)",
    "TPU": "TPU (₹25/g)",
    "PETG": "PETG (₹40/g)"
  };
  return map[m] || String(m);
}

// Helper function to resolve shipping name
function getShippingName(s: number | string): string {
  const map: Record<number | string, string> = {
    1: "Standard (5-7 days)",
    2: "Express (2-3 days) [+50%]",
    3: "Same Day (1-2 days) [+100%]"
  };
  return map[s] || String(s);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      phone,
      email,
      message,
      material,
      color,
      quantity,
      weight,
      infill,
      shipping,
      fileKey,
      fileName,
    } = body;

    // 1. Calculate Price Breakdown Server-side
    const numWeight = Number(weight || 0);
    const numQuantity = Number(quantity || 1);
    
    let materialRate = 0;
    if (material === 1 || material === "1" || String(material).toLowerCase() === "pla") materialRate = 10;
    else if (material === 2 || material === "2" || String(material).toLowerCase() === "abs") materialRate = 15;
    else if (material === 3 || material === "3" || String(material).toLowerCase() === "tpu") materialRate = 25;
    else if (material === 4 || material === "4" || String(material).toLowerCase() === "petg") materialRate = 40;

    const baseMaterialCost = numWeight * materialRate;

    const infillMultiplier: Record<number, number> = {
      1: 0, 2: 0.1, 3: 0.3, 4: 0.4, 5: 0.5, 6: 0.6, 7: 0.7, 8: 0.8, 9: 0.9, 10: 1
    };
    const infillKey = Number(infill || 1);
    const infillAdjustment = baseMaterialCost * (infillMultiplier[infillKey] || 0);

    const shippingMultiplier: Record<number, number> = {
      1: 0, 2: 0.5, 3: 1
    };
    const shippingKey = Number(shipping || 1);
    const subtotal = (baseMaterialCost + infillAdjustment) * numQuantity;
    const shippingValue = subtotal * (shippingMultiplier[shippingKey] || 0);
    const totalCost = Math.ceil(subtotal + shippingValue);

    // 2. Generate details strings
    const resolvedMaterial = getMaterialName(material);
    const resolvedInfill = `${Number(infill) * 10}%`;
    const resolvedShipping = getShippingName(shipping);
    
    // File Download Link from Backblaze B2
    const b2Bucket = process.env.B2_BUCKET_NAME || "threeditron";
    const b2Endpoint = process.env.B2_ENDPOINT || "s3.us-east-005.backblazeb2.com";
    const downloadUrl = `https://${b2Bucket}.${b2Endpoint}/${fileKey}`;

    // 3. Setup Nodemailer Transporter
    const host = process.env.SMTP_HOST || "smtp.gmail.com";
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const adminEmail = process.env.CONTACT_EMAIL || "threeditron.1005@gmail.com";

    let emailStatus = "Not Sent (SMTP config missing)";

    if (user && pass && user !== "your_gmail_app_password") {
      const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465, // true for 465, false for other ports
        auth: { user, pass },
      });

      // Email Body for Client
      const clientMailOptions = {
        from: `"THREEDITRON Support" <${user}>`,
        to: email,
        subject: "Confirmation: Your 3D Printing Quote Request Received! 🖨️",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #111; border: 1px solid #eab308; border-radius: 12px; overflow: hidden;">
            <div style="background-color: #000; padding: 20px; text-align: center; border-bottom: 2px solid #eab308;">
              <h1 style="color: #eab308; margin: 0; font-size: 24px; letter-spacing: 1px;">THREEDITRON</h1>
              <p style="color: #888; margin: 5px 0 0 0; font-size: 12px;">Professional 3D Printing Services</p>
            </div>
            <div style="padding: 24px; background-color: #fafafa;">
              <h2 style="margin-top: 0; color: #111;">Hello ${name},</h2>
              <p style="line-height: 1.6; color: #444;">
                Thank you for submitting your quote request to THREEDITRON. We have successfully logged your details. Our engineer is reviewing your STL file model and will contact you via Phone/WhatsApp shortly.
              </p>
              
              <div style="background-color: #fff; border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #eab308; border-bottom: 1px solid #f1f5f9; padding-bottom: 8px;">Quotation Summary</h3>
                <table style="width: 100%; font-size: 13px; line-height: 1.8;">
                  <tr>
                    <td style="color: #666; font-weight: bold;">STL File:</td>
                    <td>${fileName}</td>
                  </tr>
                  <tr>
                    <td style="color: #666; font-weight: bold;">Weight:</td>
                    <td>${numWeight} grams</td>
                  </tr>
                  <tr>
                    <td style="color: #666; font-weight: bold;">Material:</td>
                    <td>${resolvedMaterial}</td>
                  </tr>
                  <tr>
                    <td style="color: #666; font-weight: bold;">Infill:</td>
                    <td>${resolvedInfill}</td>
                  </tr>
                  <tr>
                    <td style="color: #666; font-weight: bold;">Color:</td>
                    <td>${color}</td>
                  </tr>
                  <tr>
                    <td style="color: #666; font-weight: bold;">Quantity:</td>
                    <td>${numQuantity}</td>
                  </tr>
                  <tr>
                    <td style="color: #666; font-weight: bold;">Shipping:</td>
                    <td>${resolvedShipping}</td>
                  </tr>
                  <tr style="font-size: 15px; font-weight: bold; border-top: 1px solid #f1f5f9;">
                    <td style="padding-top: 8px; color: #111;">Estimated Total:</td>
                    <td style="padding-top: 8px; color: #eab308;">₹${totalCost}</td>
                  </tr>
                </table>
              </div>

              <p style="font-size: 11px; color: #888; line-height: 1.4;">
                *Note: This is an automated estimate based on the model geometry and parameters. The final pricing is subject to manual verification of printable thickness and features.
              </p>
            </div>
            <div style="background-color: #000; color: #fff; padding: 15px; text-align: center; font-size: 11px;">
              <p style="margin: 0;">© 2026 THREEDITRON. Sidhgora, Jamshedpur, JH, India.</p>
              <p style="margin: 5px 0 0 0; color: #eab308;">Phone: +91 7209827299 | Email: threeditron.1005@gmail.com</p>
            </div>
          </div>
        `,
      };

      // Email Body for Owner
      const adminMailOptions = {
        from: `"THREEDITRON Quote System" <${user}>`,
        to: adminEmail,
        subject: `NEW QUOTE REQUEST - ${name} (${phone}) 🖨️`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #111; border: 1px solid #eab308; border-radius: 12px; overflow: hidden;">
            <div style="background-color: #000; padding: 20px; text-align: center;">
              <h1 style="color: #eab308; margin: 0; font-size: 20px;">New 3D Print Quote Request</h1>
            </div>
            <div style="padding: 20px; background-color: #fff;">
              <h3 style="color: #eab308;">Customer Information</h3>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Phone:</strong> <a href="tel:${phone}">${phone}</a></p>
              <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
              <p><strong>Message:</strong> ${message || "No custom message provided."}</p>

              <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />

              <h3 style="color: #eab308;">Model & Printing Parameters</h3>
              <p><strong>File Name:</strong> ${fileName}</p>
              <p><strong>Weight:</strong> ${numWeight}g</p>
              <p><strong>Material:</strong> ${resolvedMaterial}</p>
              <p><strong>Infill %:</strong> ${resolvedInfill}</p>
              <p><strong>Color:</strong> ${color}</p>
              <p><strong>Quantity:</strong> ${numQuantity}</p>
              <p><strong>Shipping Selection:</strong> ${resolvedShipping}</p>
              <p><strong>Estimated Quote:</strong> ₹${totalCost}</p>

              <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />

              <h3 style="color: #eab308;">STL Model Access</h3>
              <p>The file is stored securely on Backblaze B2.</p>
              <p>
                <a href="${downloadUrl}" style="display: inline-block; background-color: #eab308; color: #000; text-decoration: none; padding: 10px 18px; border-radius: 6px; font-weight: bold;" target="_blank">
                  Download STL File
                </a>
              </p>
              <p style="font-size: 10px; color: #888; overflow-wrap: break-word;">${downloadUrl}</p>
            </div>
          </div>
        `,
      };

      try {
        await transporter.sendMail(clientMailOptions);
        await transporter.sendMail(adminMailOptions);
        emailStatus = "Emails Sent Successfully";
      } catch (err: any) {
        console.error("Nodemailer Send Error:", err);
        emailStatus = `SMTP Connection Succeeded but Sending Failed: ${err.message}`;
      }
    } else {
      console.warn("SMTP credentials are missing or default. Email notification skipped.");
    }

    return NextResponse.json({
      success: true,
      message: "Quote confirmation recorded.",
      emailStatus,
      totalCost,
      breakdown: {
        baseMaterialCost: Math.ceil(baseMaterialCost),
        infillAdjustment: Math.ceil(infillAdjustment),
        shippingValue: Math.ceil(shippingValue)
      }
    });

  } catch (error: any) {
    console.error("Quote Confirm API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to confirm quotation request." },
      { status: 500 }
    );
  }
}
