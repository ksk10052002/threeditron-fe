import { registerForm } from "@/types/type";
import jsPDF from "jspdf";

export const generateReceiptPDF = (formData: registerForm) => {
  const doc = new jsPDF();

  // --- LOGO ---
  const logoPath = "/main-logo.png"; // from public/
  const img = new Image();
  img.src = logoPath;

  img.onload = () => {
    // Add golden gradient background effect (simulated with rectangles)
    doc.setFillColor(255, 251, 235); // Very light amber
    doc.rect(0, 0, 210, 297, "F");

    // Top decorative bar
    doc.setFillColor(251, 191, 36); // amber-400
    doc.rect(0, 0, 210, 8, "F");

    // Logo
    doc.addImage(img, "PNG", 15, 15, 35, 35);

    // --- INSTITUTE NAME (Elegant Header) ---
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("GLAM INSTITUTE OF", 105, 25, { align: "center" });

    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("FASHION DESIGNING", 105, 33, { align: "center" });

    // Decorative line under header
    doc.setDrawColor(251, 191, 36); // amber-400
    doc.setLineWidth(0.5);
    doc.line(40, 40, 170, 40);

    // --- RECEIPT TITLE ---
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("REGISTRATION RECEIPT", 105, 50, { align: "center" });

    // Receipt details box
    doc.setFillColor(254, 243, 199); // amber-100
    doc.roundedRect(15, 55, 180, 15, 2, 2, "F");

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(120, 53, 15); // amber-900
    doc.text(
      `Receipt Date: ${new Date().toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}`,
      105,
      60,
      { align: "center" },
    );
    doc.text(
      `Registration ID: GI-${Date.now().toString().slice(-8)}`,
      105,
      66,
      { align: "center" },
    );

    // --- CONTENT SECTIONS ---
    let y = 80;

    // Helper function to create section headers
    const sectionHeader = (title: string) => {
      doc.setFillColor(251, 191, 36); // amber-400
      doc.roundedRect(15, y, 180, 10, 2, 2, "F");
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.text(title, 20, y + 7);
      y += 15;
    };

    // Helper function for fields
    const field = (
      label: string,
      value: string,
      fullWidth: boolean = false,
    ) => {
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(120, 53, 15); // amber-900
      doc.text(`${label}:`, 20, y);

      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);
      const displayValue = value || "-";

      if (fullWidth) {
        const lines = doc.splitTextToSize(displayValue, 170);
        doc.text(lines, 20, y + 5);
        y += 5 + lines.length * 5;
      } else {
        doc.text(displayValue, 85, y);
      }
      y += 7;
    };

    // PERSONAL INFORMATION
    sectionHeader("PERSONAL INFORMATION");
    field(
      "Full Name",
      `${formData.firstName} ${formData.middleName || ""} ${
        formData.lastName
      }`.trim(),
    );
    field("Gender", formData.gender);
    field("Date of Birth", formData.dateOfBirth);
    y += 3;

    // CONTACT DETAILS
    sectionHeader("CONTACT DETAILS");
    field("Mobile Number", `${formData.countryCode} ${formData.mobileNumber}`);
    field("Parent Mobile", formData.parentMobile || "-");
    field("Email Address", formData.emailId);
    y += 3;

    // COURSE DETAILS
    sectionHeader("COURSE DETAILS");
    field("Course Type", formData.courseType);
    field("Selected Course", formData.choiceOfCourse);
    y += 3;

    // ADDRESS DETAILS
    sectionHeader("ADDRESS DETAILS");
    field("Country", formData.country);
    field("State", formData.state);
    field("City", formData.city);
    field("Full Address", formData.address, true);

    // --- DECORATIVE FOOTER ---
    const footerY = 270;

    // Bottom decorative bar
    doc.setFillColor(251, 191, 36); // amber-400
    doc.rect(0, 285, 210, 12, "F");

    // Footer border
    doc.setDrawColor(251, 191, 36);
    doc.setLineWidth(0.5);
    doc.line(15, footerY, 195, footerY);

    // Footer text
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(120, 53, 15);
    doc.text(
      "This is a system-generated receipt. No signature required.",
      105,
      footerY + 5,
      { align: "center" },
    );

    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text("Welcome to Glam Institute of Fashion Designing!", 105, 291, {
      align: "center",
    });

    // --- OPEN PRINT / DOWNLOAD ---
    doc.autoPrint();
    window.open(doc.output("bloburl"), "_blank");
  };

  // Error handling if image fails to load
  img.onerror = () => {
    console.error("Logo failed to load, generating receipt without logo");

    // Generate receipt without logo
    doc.setFillColor(255, 251, 235);
    doc.rect(0, 0, 210, 297, "F");

    doc.setFillColor(251, 191, 36);
    doc.rect(0, 0, 210, 8, "F");
  };
};
