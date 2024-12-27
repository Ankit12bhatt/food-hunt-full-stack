import { useEffect, useState } from 'react';

export default function Countdown(props) {
  const [seconds, setSeconds] = useState(props.timeLeft);
  
  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds - 1);
    }, 1000);
    // Clear interval when countdown reaches 0
    if (seconds === 0) {
      clearInterval(interval);
    }
    // Cleanup function to clear interval when component unmounts
    return () => clearInterval(interval);
  });

  return seconds > 0 ? (
    <h6>Time Left : {formatTime(seconds)}</h6>
  ) : (
    <h6 className='text-danger'>expired</h6>
  );
}
