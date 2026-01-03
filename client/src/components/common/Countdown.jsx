import { useEffect, useState } from "react";

function Countdown({ endAt }) {
  const calc = () => {
    const diff = new Date(endAt) - new Date();
    if (diff <= 0) return null;

    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff / 3600000) % 24),
      minutes: Math.floor((diff / 60000) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  };

  const [time, setTime] = useState(calc());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(calc());
    }, 1000);
    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endAt]);

  if (!time) return null;

  return (
    <div className="flex gap-4 justify-center text-center text-white">
      {Object.entries(time).map(([k, v]) => (
        <div key={k} className="bg-red-600 px-4 py-2 rounded">
          <div className="text-xl font-bold">{v}</div>
          <div className="text-sm">{k}</div>
        </div>
      ))}
    </div>
  );
}

export default Countdown;
