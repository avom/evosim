import { World } from "./engine/world";
import "./style.css";

const canvas = document.getElementById("world") as HTMLCanvasElement;

if (canvas) {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  const world = new World(canvas.width, canvas.height);
  world.init();

  const context = canvas.getContext("2d");
  if (context)
    world.draw(context);

  let prev_t0 = performance.now();

  const drawTimes: number[] = [];
  const tickTimes: number[] = [];

  const goalFps = 30;
  const avg = (a: number[]) => a.reduce((acc: number, t: number) => acc + t, 0) / a.length;
  const recentAvg = (a: number[]) => avg(a.slice(a.length - goalFps, a.length));

  const gameLoop = setInterval(() => {
    if (context) {
      const t0 = performance.now();
      world.tick((t0 - prev_t0) / 1000);
      const t1 = performance.now();
      world.draw(context);
      const t2 = performance.now();
      prev_t0 = t0;

      tickTimes.push(t1 - t0);
      drawTimes.push(t2 - t1);
      if (tickTimes.length % goalFps == 0) {
        const avgTick = recentAvg(tickTimes);
        const avgDraw = recentAvg(drawTimes);
        console.log(`${avgTick.toFixed(2)} ${avgDraw.toFixed(2)} ${(avgTick + avgDraw).toFixed(2)}`);
      }
    }
  }, 33);
}
