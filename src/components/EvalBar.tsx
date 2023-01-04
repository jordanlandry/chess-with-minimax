import clamp from "../helpers/clamp";
import useWidth from "../hooks/useWidth";

type Props = { evaluation: number; height: number };

export default function EvalBar({ evaluation, height }: Props) {
  const MAX_EVAL = 25;
  const MIN_EVAL = -25;

  const percentPositive = clamp((evaluation - MIN_EVAL) / (MAX_EVAL - MIN_EVAL), 0, 1);
  const width = useWidth();
  const size = 25;

  const isVertical = width > 600;

  return (
    <div className="eval-bar-wrapper" style={{ height: height, width: "25px" }}>
      <div className="eval-negative eval-bar" style={{ height: `${(1 - percentPositive) * height}px` }}>
        {evaluation <= 0 ? <span className="eval-text">{Math.round(evaluation * 10) / -10}</span> : null}
      </div>
      <div className="eval-positive eval-bar" style={{ height: "100%", transition: "200ms" }}>
        {evaluation >= 0 ? <span className="eval-text">{Math.round(evaluation * 10) / 10}</span> : null}
      </div>
    </div>
  );
}
