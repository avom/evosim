export function shuffleArray<T>(array: T[]): T[] {
  let result = array.slice();
  shuffleArrayInPlace(result);
  return result;
}

export function shuffleArrayInPlace<T>(array: T[]): void {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}