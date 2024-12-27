class Cell {

  private readonly angleRad: number;
  private readonly rx: number;
  private readonly ry: number;
  private readonly color: string;

  constructor(angleRad: number, rx: number, ry: number, color: string) {
    this.angleRad = angleRad
    this.rx = rx;
    this.ry = ry;
    this.color = color;
  }
  draw(coreX: number, coreY: number, coreR: number, context: CanvasRenderingContext2D): void {
    context.fillStyle = "#fff";
    context.strokeStyle = this.color;

    const x = coreX + Math.cos(this.angleRad) * (coreR + this.rx);
    const y = coreY + Math.sin(this.angleRad) * (coreR + this.ry);
    context.beginPath();
    context.ellipse(x, y, this.rx * coreX, this.ry * coreY, this.angleRad, 0, 0);
    context.stroke();
  }
}