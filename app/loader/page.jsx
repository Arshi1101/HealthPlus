"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Loader() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/dashboard"); // 👈 change this path
    }, 3000); // 3 sec delay

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-black">
      <svg
        width="280"
        height="280"
        viewBox="-5 -5 40 40"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Circles with glowing animation */}
        <circle fill="#4b0082" r="0.1" filter="url(#glow)">
          <animateMotion
            path="M 23.8 0.5 C 17.5 -1.4 1.4 20.9 9.9 27.3 C 14.2 30.5 21.9 22.9 23.8 17.8 C 28 7 2.1 3.3 0.4 11.6 C -0.4 15.9 10 18.3 12.6 18.7 C 25.2 20.5 31.5 2.9 23.8 0.5 Z"
            repeatCount="indefinite"
            begin="-0s"
            dur="3.5s"
          />
        </circle>
        <circle fill="#5c00a3" r="0.15" filter="url(#glow)">
          <animateMotion
            path="M 23.8 0.5 C 17.5 -1.4 1.4 20.9 9.9 27.3 C 14.2 30.5 21.9 22.9 23.8 17.8 C 28 7 2.1 3.3 0.4 11.6 C -0.4 15.9 10 18.3 12.6 18.7 C 25.2 20.5 31.5 2.9 23.8 0.5 Z"
            repeatCount="indefinite"
            begin="-0.05s"
            dur="3.5s"
          />
        </circle>
        <circle fill="#6d00c4" r="0.2" filter="url(#glow)">
          <animateMotion
            path="M 23.8 0.5 C 17.5 -1.4 1.4 20.9 9.9 27.3 C 14.2 30.5 21.9 22.9 23.8 17.8 C 28 7 2.1 3.3 0.4 11.6 C -0.4 15.9 10 18.3 12.6 18.7 C 25.2 20.5 31.5 2.9 23.8 0.5 Z"
            repeatCount="indefinite"
            begin="-0.1s"
            dur="3.5s"
          />
        </circle>
        <circle fill="#7e00e5" r="0.25" filter="url(#glow)">
          <animateMotion
            path="M 23.8 0.5 C 17.5 -1.4 1.4 20.9 9.9 27.3 C 14.2 30.5 21.9 22.9 23.8 17.8 C 28 7 2.1 3.3 0.4 11.6 C -0.4 15.9 10 18.3 12.6 18.7 C 25.2 20.5 31.5 2.9 23.8 0.5 Z"
            repeatCount="indefinite"
            begin="-0.15s"
            dur="3.5s"
          />
        </circle>
        <circle fill="#8f00ff" r="0.3" filter="url(#glow)">
          <animateMotion
            path="M 23.8 0.5 C 17.5 -1.4 1.4 20.9 9.9 27.3 C 14.2 30.5 21.9 22.9 23.8 17.8 C 28 7 2.1 3.3 0.4 11.6 C -0.4 15.9 10 18.3 12.6 18.7 C 25.2 20.5 31.5 2.9 23.8 0.5 Z"
            repeatCount="indefinite"
            begin="-0.2s"
            dur="3.5s"
          />
        </circle>
      </svg>
    </div>
  );
}