import { World } from "./engine/world";
import "./assets/style.css";
import { Settings } from "./engine/settings";
import { millisToTimeStr } from "./utils";
import { Plant } from "./engine/plant";
import { BlueBug } from "./engine/blue-bug";
import { RedBug } from "./engine/red-bug";

function updateStat(elementId: string, value: string) {
  const elem = document.getElementById(elementId);
  if (elem) {
    elem.innerText = value;
  }
}

const canvas = document.getElementById("world") as HTMLCanvasElement;

if (canvas) {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  const world = new World(canvas.width, canvas.height);
  world.init();

  const context = canvas.getContext("2d");
  if (context)
    world.draw(context);

  canvas.onclick = (event: MouseEvent) => {
    const rect = canvas.getBoundingClientRect();
    const bug = world.selectBugAt(event.x - rect.left, event.y - rect.top);
    if (!bug) {
      return;
    }

    updateStat("selected-bug-type", bug instanceof RedBug ? "red" : "blue");
    updateStat("selected-bug-id", bug.id.toString());
    updateStat("selected-bug-generation", bug.generation.toString());
  }

  let prev_t0 = performance.now();
  let startTime = performance.now();

  const drawTimes: number[] = [];
  const tickTimes: number[] = [];

  const goalFps = 30;
  const avg = (a: number[]) => a.reduce((acc: number, t: number) => acc + t, 0) / a.length;
  const recentAvg = (a: number[]) => avg(a.slice(a.length - goalFps, a.length));

  let simulationTime = 0;

  const gameLoop = setInterval(() => {
    if (context) {
      const t0 = performance.now();
      const dt = (t0 - prev_t0) / 1000;
      const frameTime = Math.min(dt, Settings.general.maxFrameDurationSeconds);
      world.tick(frameTime);
      const t1 = performance.now();
      world.draw(context);
      const t2 = performance.now();
      prev_t0 = t0;

      tickTimes.push(t1 - t0);
      drawTimes.push(t2 - t1);

      simulationTime += frameTime;
      if (tickTimes.length % goalFps == 0) {
        const avgTick = recentAvg(tickTimes);
        const avgDraw = recentAvg(drawTimes);
        console.log(`${avgTick.toFixed(2)} ${avgDraw.toFixed(2)} ${(avgTick + avgDraw).toFixed(2)}`);
      }

      updateStat("frame", tickTimes.length.toString());
      updateStat("time", millisToTimeStr((t2 - startTime) / 1000));
      updateStat("simulation-time", millisToTimeStr(simulationTime));
      updateStat("plant-count", world.getOrganismCount(Plant).toString());
      updateStat("blue-bug-count", world.getOrganismCount(BlueBug).toString());
      updateStat("red-bug-count", world.getOrganismCount(RedBug).toString());
    }
  }, 33);
}
