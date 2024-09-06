import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

//component for Admin to see all sales
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

  const timerComponents = [];

  Object.keys(timeLeft).forEach((interval) => {
    if (!timeLeft[interval]) {
      return;
    }

    timerComponents.push(
      <span key={interval}>
        {timeLeft[interval]} {interval}{" "}
      </span>
    );
  });

  return (
    <div>
      {timerComponents.length ? timerComponents : <span>Sale has ended!</span>}
    </div>
  );
};

export default function AllFlashsales({ products }) {
  const now = new Date();
  const uniqueTimes = Array.from(
    new Set(products.map((product) => product.saleTime))
  );

  const saleTimesWithCount = uniqueTimes
    .map((saleTime) => {
      const targetTime = new Date(saleTime);
      if (targetTime > now) {
        const productsInSaleTime = products.filter(
          (product) => product.saleTime === saleTime
        );
        return { saleTime, productsCount: productsInSaleTime.length };
      }
      return null;
    })
    .filter(Boolean);

  return (
    <div>
      {saleTimesWithCount.map(({ saleTime, productsCount }) => (
        <div key={saleTime} style={{ margin: 15 }}>
          <p>Sale ends at: {saleTime}</p>
          <p>Products in this sale: {productsCount}</p>
          <CountdownTimer targetTime={new Date(saleTime)} />
          <div className="flashprodsrow">
            {products.map((p) => (
              <div key={p._id} className="flashprodsitem">
                <Link to={`/admin/product/${p.slug}`}>
                  {`${p.slug && p.slug.substring(0, 10)}...`}
                </Link>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
