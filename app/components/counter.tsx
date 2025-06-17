export default function Counter({
  value,
  max,
  min,
  onChange,
  width = 56,
}: {
  value: number;
  max: number;
  min: number;
  onChange: (count: number) => void;
  width?: number;
}) {
  const handleClick = (delta: number) => {
    const next = value + delta;
    if (next >= min && next <= max) {
      onChange(next);
    }
  };
  return (
    <div className="flex bg-gray-light p-1 rounded">
      <button
        className="bg-primary-dark rounded text-white px-1 transition hover:bg-primary-light active:bg-black cursor-pointer disabled:bg-gray-dark disabled:cursor-default"
        onClick={() => handleClick(-1)}
        disabled={value <= min}
      >
        －
      </button>
      <div className="text-center" style={{ width: `${width}px` }}>
        {value}
      </div>
      <button
        className="bg-primary-dark rounded text-white px-1 transition hover:bg-primary-light active:bg-black cursor-pointer disabled:bg-gray-dark disabled:cursor-default"
        onClick={() => handleClick(+1)}
        disabled={value >= max}
      >
        ＋
      </button>
    </div>
  );
}
