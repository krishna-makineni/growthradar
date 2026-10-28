import QRCode from "qrcode";
import fs from "fs";
import path from "path";

const targetUrl = "https://growthradar-gamma.vercel.app/";
const publicDir = path.resolve("./public");
const artifactDir = "C:\\Users\\chinn\\.gemini\\antigravity-ide\\brain\\803314bf-6e84-44ec-ac48-1558e114ba3b";

async function generate() {
  // 1. High-res PNG (White on transparent/dark or dark on white)
  // Let's generate a crisp standard high-contrast QR code (black on white with rounded quiet zone)
  const pngPath = path.join(publicDir, "growthradar-qr.png");
  await QRCode.toFile(pngPath, targetUrl, {
    errorCorrectionLevel: "H",
    type: "png",
    margin: 2,
    width: 800,
    color: {
      dark: "#070B14",
      light: "#FFFFFF",
    },
  });
  console.log("Generated PNG:", pngPath);

  // 2. High-res SVG
  const svgPath = path.join(publicDir, "growthradar-qr.svg");
  const svgString = await QRCode.toString(targetUrl, {
    errorCorrectionLevel: "H",
    type: "svg",
    margin: 2,
    color: {
      dark: "#070B14",
      light: "#FFFFFF",
    },
  });
  fs.writeFileSync(svgPath, svgString);
  console.log("Generated SVG:", svgPath);

  // 3. Dark-theme branded version (Electric Lime #C5F56A on Dark Navy #070B14)
  const brandedPngPath = path.join(publicDir, "growthradar-qr-branded.png");
  await QRCode.toFile(brandedPngPath, targetUrl, {
    errorCorrectionLevel: "H",
    type: "png",
    margin: 2,
    width: 800,
    color: {
      dark: "#C5F56A",
      light: "#070B14",
    },
  });
  console.log("Generated Branded PNG:", brandedPngPath);

  // Copy to artifacts for easy embedding & preview
  if (fs.existsSync(artifactDir)) {
    fs.copyFileSync(pngPath, path.join(artifactDir, "growthradar-qr.png"));
    fs.copyFileSync(svgPath, path.join(artifactDir, "growthradar-qr.svg"));
    fs.copyFileSync(brandedPngPath, path.join(artifactDir, "growthradar-qr-branded.png"));
    console.log("Copied QR codes to artifact directory.");
  }

  // Also print an ASCII QR code to terminal for instant preview
  const terminalString = await QRCode.toString(targetUrl, { type: "terminal", small: true });
  console.log("\nTerminal QR Preview:\n");
  console.log(terminalString);
}

generate().catch(console.error);
