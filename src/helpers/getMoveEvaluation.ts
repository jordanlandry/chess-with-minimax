export default function getMoveEvaluation(prev: number, newVal: number) {
  const difference = newVal - prev;

  return difference < -2
    ? "blunder"
    : difference < -1
    ? "mistake"
    : difference < 0
    ? "inaccuracy"
    : difference < 1
    ? "good"
    : difference < 1.5
    ? "great"
    : difference < 2
    ? "brilliant"
    : "masterful";
}
