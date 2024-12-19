import React from "react";
import { useState, useEffect } from "react";

interface ResponseProps {
  data: string
  className: string
}

const Response: React.FC<ResponseProps> = ({ data, className }) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    if (data) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [data]);

  if (!data || !isVisible) return null;
  return (
    <div className={`${className} fade-in-out response`}>
      <p>{data}</p>
    </div>
  );
};

export default Response;
