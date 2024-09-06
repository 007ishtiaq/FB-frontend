import React, { useState, useEffect } from "react";

export default function Countdown({ saleTime, checkprodFlash }) {
  const [saleEnded, setSaleEnded] = useState(false);

  const now = new Date();

  useEffect(() => {
    const countdown = setInterval(() => {
      if (new Date() >= new Date(saleTime)) {
        clearInterval(countdown);
        setSaleEnded(true);
      }
    }, 1000);

    return () => clearInterval(countdown);
  }, [saleTime]);

  useEffect(() => {
    if (saleEnded) {
      checkprodFlash();
      setTimeout(() => {
        window.location.reload();
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
      <>
        {!saleEnded ? (
          <div className="flashtimercon">
            <span className="timertxt">Time Left:</span>
            <div className="prodflashtimer">
              <div className="timerself">{formatHours(timeLeft.hours)}</div>
              <span>:</span>
              <div className="timerself">{formatMinutes(timeLeft.minutes)}</div>
              <span>:</span>
              <div className="timerself">{formatSeconds(timeLeft.seconds)}</div>
            </div>
          </div>
        ) : (
          <div className="flashtimercon">
            <span className="timertxt">Time Left:</span>
            <div className="prodflashtimer">
              <div className="timerself">00</div>
              <span>:</span>
              <div className="timerself">00</div>
              <span>:</span>
              <div className="timerself">00</div>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <div>
      <CountdownTimer targetTime={new Date(saleTime)} />
    </div>
  );
}

// previous logic countdown
// export default function Countdown({ date, timeUp }) {
// const [days, setDays] = useState(0);
// const [hours, setHours] = useState(0);
// const [minutes, setMinutes] = useState(0);
// const [seconds, setSeconds] = useState(0);

// useEffect(() => {
//   const getdeadline = new Date(date).getTime();
//   const now = new Date().getTime();
//   const gap = getdeadline - now; // its in miliseconds

//   const interval = setInterval(() => {
//     if (gap > 0) getTime();
//   }, 1000);

//   if (gap <= 0) {
//     setDays(0);
//     setHours(0);
//     setMinutes(0);
//     setSeconds(0);
//     timeUp();
//   }

//   return () => clearInterval(interval);
// }, [date, seconds]);

// const getTime = () => {
//   const getdeadline = new Date(date).getTime();
//   const now = new Date().getTime();
//   const gap = getdeadline - now; // its in miliseconds

//   const second = 1000;
//   const minute = second * 60;
//   const hour = minute * 60;
//   const day = hour * 24;

//   setDays(formatDays(Math.floor(gap / day)));
//   setHours(formatHours(Math.floor((gap % day) / hour)));
//   setMinutes(formatMinutes(Math.floor((gap % hour) / minute)));
//   setSeconds(formatSeconds(Math.floor((gap % minute) / second)));
// };

// const formatDays = (data) => {
//   return data < 10 ? `0${data}` : data;
// };
// const formatHours = (data) => {
//   return data < 10 ? `0${data}` : data;
// };
// const formatMinutes = (data) => {
//   return data < 10 ? `0${data}` : data;
// };
// const formatSeconds = (data) => {
//   return data < 10 ? `0${data}` : data;
// };
// return (
//   <>
//     <div class="colorheading timecont">
//       <span className="timetxt">Ending in</span>
//       <div className="timer">
//         <div className="timeself">{hours}</div>
//         <span>:</span>
//         <div className="timeself">{minutes}</div>
//         <span>:</span>
//         <div className="timeself">{seconds}</div>
//       </div>
//     </div>
//   </>
// );
