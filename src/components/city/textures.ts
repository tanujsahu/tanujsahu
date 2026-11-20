import { CanvasTexture, LinearFilter, SRGBColorSpace, type Texture } from "three";

const cache = new Map<string, Texture>();
const labels = new Map<string, Texture>();

export function getLabelTexture(label: string, district: string, accent: string) {
  const key = `${label}|${district}|${accent}`;
  const existing = labels.get(key);
  if (existing) return existing;

  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 360;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Unable to draw location label");

  context.clearRect(0, 0, canvas.width, canvas.height);
  roundRect(context, 24, 28, 976, 304, 72);
  context.fillStyle = "rgba(6, 10, 20, 0.9)";
  context.fill();
  context.lineWidth = 10;
  context.strokeStyle = accent;
  context.stroke();

  context.save();
  context.translate(118, 180);
  context.rotate(Math.PI / 4);
  context.fillStyle = accent;
  context.fillRect(-22, -22, 44, 44);
  context.restore();

  context.fillStyle = accent;
  context.font = "700 28px Segoe UI, sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(district.toUpperCase(), 560, 108, 760);

  context.fillStyle = "#f8fbff";
  context.font = "700 92px Segoe UI, sans-serif";
  context.fillText(label, 560, 198, 780);

  context.strokeStyle = accent;
  context.lineWidth = 8;
  context.lineCap = "round";
  context.beginPath();
  context.moveTo(300, 262);
  context.lineTo(820, 262);
  context.stroke();

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.minFilter = LinearFilter;
  texture.needsUpdate = true;
  labels.set(key, texture);
  return texture;
}

function roundRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.arcTo(x + width, y, x + width, y + height, radius);
  context.arcTo(x + width, y + height, x, y + height, radius);
  context.arcTo(x, y + height, x, y, radius);
  context.arcTo(x, y, x + width, y, radius);
  context.closePath();
}

export function getFacadeTexture(
  key: string,
  floors: number,
  columns: number,
  seed: number,
  lights: string[],
) {
  const id = `${key}:${floors}:${columns}:${lights.join(",")}`;
  const existing = cache.get(id);
  if (existing) return existing;

  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 512;
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Unable to draw building facade");
  }

  const gradient = context.createLinearGradient(0, 0, 0, 512);
  gradient.addColorStop(0, "#243044");
  gradient.addColorStop(1, "#121926");
  context.fillStyle = gradient;
  context.fillRect(0, 0, 256, 512);

  const marginX = 16;
  const marginY = 18;
  const gapX = 8;
  const gapY = 10;
  const cellWidth = (256 - marginX * 2 - gapX * (columns - 1)) / columns;
  const cellHeight = (512 - marginY * 2 - gapY * (floors - 1)) / floors;

  for (let row = 0; row < floors; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const x = marginX + column * (cellWidth + gapX);
      const y = marginY + row * (cellHeight + gapY);
      const noise = Math.abs(Math.sin(seed + row * 2.7 + column * 4.3));
      context.fillStyle = noise > 0.46 ? lights[Math.floor(noise * lights.length) % lights.length] : "#091018";
      context.fillRect(x, y, cellWidth, cellHeight);
      context.fillStyle = "rgba(255,255,255,0.16)";
      context.fillRect(x, y, cellWidth, Math.max(1.5, cellHeight * 0.08));
    }
  }

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.needsUpdate = true;
  cache.set(id, texture);
  return texture;
}
