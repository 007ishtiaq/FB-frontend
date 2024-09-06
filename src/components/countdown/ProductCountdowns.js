import React, { useState, useEffect } from "react";

export default function ProductCountdowns({ products, getcurrentFlash }) {
  const [saleEnded, setSaleEnded] = useState(false);

  const now = new Date();
  const uniqueTimes = Array.from(
    new Set(products.map((product) => new Date(product.saleTime)))
  );

  const nearestSaleTime = uniqueTimes
    .filter((time) => time >= now) // Filter out past sale times
    .sort((a, b) => a - b)[0];

  useEffect(() => {
    const countdown = setInterval(() => {
      if (new Date() >= nearestSaleTime) {
        clearInterval(countdown);
        setSaleEnded(true);
      }
    }, 1000);

    return () => clearInterval(countdown);
  }, [nearestSaleTime]);

  useEffect(() => {
    if (saleEnded) {
      setTimeout(() => {
        getcurrentFlash();
        // window.location.reload();
      }, 3000); // Reload after 3 seconds when the sale ends
    }
  }, [saleEnded]);

  const CountdownTimer = ({ targetTime }) => {
    const calculateTimeLeft = () => {
      const difference = targetTime - new Date();
      let timeLeft = {};

      if (difference > 0) {
        timeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }

      return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
      const timer = setTimeout(() => {
        setTimeLeft(calculateTimeLeft());
      }, 1000);

      return () => clearTimeout(timer);
    });

    const formatDays = (data) => {
      return data < 10 ? `0${data}` : data;
    };

    const formatHours = (data) => {
      return data < 10 ? `0${data}` : data;
    };

    const formatMinutes = (data) => {
      return data < 10 ? `0${data}` : data;
    };

    const formatSeconds = (data) => {
      return data < 10 ? `0${data}` : data;
    };

    return (
      <div>
        {!saleEnded ? (
          <div className="colorheading timecont">
            <span className="timetxt">Ending in</span>
            <div className="timer">
              <div className="timeself">{formatHours(timeLeft.hours)}</div>
              <span>:</span>
              <div className="timeself">{formatMinutes(timeLeft.minutes)}</div>
              <span>:</span>
              <div className="timeself">{formatSeconds(timeLeft.seconds)}</div>
            </div>
          </div>
        ) : (
          <div className="colorheading timecont">
            <span className="timetxt">Ending in</span>
            <div className="timer">
              <div className="timeself">00</div>
              <span>:</span>
              <div className="timeself">00</div>
              <span>:</span>
              <div className="timeself">00</div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <CountdownTimer targetTime={nearestSaleTime} />
    </div>
  );
}
