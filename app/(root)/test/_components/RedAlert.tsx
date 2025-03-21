"use client";

import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";

const RedAlert = ({ message }: { message: string }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 5000); // Auto hide after 5 sec
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed top-0 left-0 w-full bg-red-600 text-white py-3 px-5 flex items-center justify-between shadow-lg z-50">
      <div className="flex items-center gap-3">
        <AlertCircle className="w-6 h-6 text-white" />
        <span className="font-semibold">{message}</span>
      </div>
      <button onClick={() => setShow(false)} className="text-white text-lg font-bold">
        ✕
      </button>
    </div>
  );
};

export default RedAlert;