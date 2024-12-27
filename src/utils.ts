export function millisToTimeStr(t: number): string {
  const s = t % 60;
  t = Math.floor(t / 60);
  const min = t % 60;
  t = Math.floor(t / 60);
  const h = t;
  
  let result = "";
  if (h > 0) {
    result += h + ":";
  }
  result += (min < 10 && min > 0 ? "0" : "") + min + ":";
  result += (s < 10 ? "0" : "") + s.toFixed(1);
  return result;
}