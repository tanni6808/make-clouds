import { useState } from "react";

export default function Counter({
  init,
  max,
  min,
  onChange,
}: {
  init: number;
  max: number;
  min: number;
  onChange: (count: number) => void;
}) {
  const [count, setCount] = useState<number>(init);
  const handleClickPlus = () => {
    if (count >= max) return;
    setCount((prev) => {
      const next = prev + 1;
      onChange(next);
      return next;
    });
  };

  const handleClickMinus = () => {
    if (count <= min) return;
    setCount((prev) => {
      const next = prev - 1;
      onChange(next);
      return next;
    });
  };
  return (
    <div className="flex bg-gray-light p-1 rounded">
      <button
        className="bg-primary-dark rounded text-white px-1 transition hover:bg-primary-light active:bg-black cursor-pointer disabled:bg-gray-dark disabled:cursor-default"
        onClick={handleClickMinus}
        disabled={count <= min}
      >
        －
      </button>
      <div className="w-14 text-center">{count}</div>
      <button
        className="bg-primary-dark rounded text-white px-1 transition hover:bg-primary-light active:bg-black cursor-pointer disabled:bg-gray-dark disabled:cursor-default"
        onClick={handleClickPlus}
        disabled={count >= max}
      >
        ＋
      </button>
    </div>
  );
}
