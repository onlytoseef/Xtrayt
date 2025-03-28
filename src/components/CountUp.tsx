
import React, { useState, useEffect } from 'react';

interface CountUpProps {
  end: number;
  duration?: number;
  decimals?: number;
  separator?: string;
}

const CountUp: React.FC<CountUpProps> = ({ 
  end, 
  duration = 2000, 
  decimals = 0,
  separator = ","
}) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (!end) return;
    
    let startTime: number;
    let animationFrame: number;
    
    const startValue = 0;
    const endValue = end;
    
    const counter = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const currentCount = Math.floor(progress * (endValue - startValue) + startValue);
      
      setCount(currentCount);
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(counter);
      } else {
        setCount(endValue);
      }
    };
    
    animationFrame = requestAnimationFrame(counter);
    
    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [end, duration]);
  
  // Format the number with commas
  const formattedCount = count.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  
  return <>{formattedCount}</>;
};

export default CountUp;
