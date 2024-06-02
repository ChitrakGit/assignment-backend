const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs');
const path = require('path');
async function generatePdf(user) {
    try {
        const filePath = path.join(process.cwd(), 'uploads', `${user.phoneNumber}.pdf`);
        const pdfDoc = await PDFDocument.create();
        const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

        const page = pdfDoc.addPage();
        const { width, height } = page.getSize();

        const fontSize = 12;
        const textX = 50;
        const textY = height - 100; 
        const text = `Name: ${user.name}\nEmail: ${user.email}\nPhone Number: ${user.phoneNumber}\nAddress: ${user.address}`;

        
        page.drawText(text, {
            x: textX,
            y: textY,
            size: fontSize,
            font: timesRomanFont,
            color: rgb(0, 0, 0),
        });

        const pdfBytes = await pdfDoc.save();
        fs.writeFileSync(filePath, pdfBytes);
        return pdfBytes;
    } catch (error) {
        throw error
    }
}

function doesPdfExistForUser(phoneNumber) {
    console.log("====",process.cwd())
    const filePath = path.join(process.cwd(), 'uploads', `${phoneNumber}.pdf`);

    return fs.existsSync(filePath);
}

module.exports = { generatePdf, doesPdfExistForUser };
