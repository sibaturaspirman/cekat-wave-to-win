import QRCode from "qrcode";

export async function createQrDataUrl(value: string): Promise<string> {
  return QRCode.toDataURL(value, {
    errorCorrectionLevel: "M",
    margin: 1,
    width: 1124,
    color: {
      dark: "#000000",
      light: "#ffffff",
    },
  });
}
