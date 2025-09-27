"use client";

import Protected from "@/components/Protected";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ThemeToggle from "../../components/ThemeToggle";


export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  // Refs for scrolling
  const tryRef = useRef(null);

  // Active card index for Try These Out
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-highlight loop
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % 6); // 6 = number of cards
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Scroll function
  const scroll = (ref, direction) => {
  if (ref.current) {
    const card = ref.current.querySelector("a");
    if (card) {
      const cardWidth = card.offsetWidth + 24; // 24px ~ gap-6
      ref.current.scrollBy({
        left: direction === "left" ? -cardWidth : cardWidth,
        behavior: "smooth",
      });
    }
  }
};
  return (
    <Protected>
      <main className="dark:to-white dark:via-blue-500 dark:from-purple-400 bg-gradient-to-t from-violet-900 via-black to-black  px-6 mx-auto py-12 min-h-screen">
        {/* Top Left Circle */}
        
<div className="absolute -bottom-1 -left-25 w-96 h-96 bg-indigo-700 rounded-full blur-3xl opacity-30 animate-pulse"></div>

{/* Top Right Circle */}
<div className="absolute -top-50 -right-2 w-96 h-96 bg-indigo-700  rounded-full blur-3xl opacity-30 animate-pulse"></div>
<div className="absolute top-4 right-4 z-50">
  <ThemeToggle />
</div>

        <h1 className="text-5xl font-bold bg-gradient-to-r from-[#8a58ce] to-[#00CAFF] bg-clip-text text-transparent text-center">
          Get healthier with NutriPlus
        </h1>
        <p className="mt-2 mb-3 text-white dark:text-black text-center">
          Welcome, {user?.email ?? user?.displayName} 👋
        </p>

        {/* White container wrapper */}
        <div className="border-t shadow shadow-xl shadow-cyan border-gray-500  mt-20"></div>
          <h2 className="text-2xl font-semibold text-center dark:text-black mt-12 bg-gradient-to-r from-[#8a58ce] to-[#00CAFF] bg-clip-text text-transparent mb-6">
            Main Features
          </h2>
          <div className="flex justify-center gap-8">
            <a
              href="/calorie"
              className="w-46 p-6 hover:scale-105 border border-2xl  border-white bg-[radial-gradient(circle_at_center,rgba(0,0,255,0.7)_0%,rgba(31,29,29,0.9)_90%)] animate-spin-slow rounded-2xl border border-gray-700 hover:bg-green-800 hover:text-white transition flex flex-col items-center justify-center"
            >
              <img src="/calorie.png" className="w-32 h-38 object-contain" />
              <div className="w-12 h-[1px] bg-white my-2"></div>
              <span className="font-semibold text-white text-center">
                Know your food
              </span>
            </a>

            <a
              href="/nut"
              className="w-46 p-6 hover:scale-105 border border-2xl border-white  bg-[radial-gradient(circle_at_center,rgba(0,0,255,0.7)_0%,rgba(31,29,29,0.9)_90%)] animate-spin-slow rounded-2xl border border-gray-700 hover:bg-green-800 hover:text-white transition flex flex-col items-center justify-center"
            >
              <img src="/cal.png" className="w-32 h-38 object-contain" />
              <div className="w-12 h-[1px] bg-white my-2"></div>
              <span className="font-semibold text-white text-center">
                Nutrition Calendar
              </span>
            </a>

            <a
              href="/recipes"
              className="w-46 p-6 border border-2xl border-white  bg-[radial-gradient(circle_at_center,rgba(0,0,255,0.7)_0%,rgba(31,29,29,0.9)_90%)] animate-spin-slow rounded-2xl border border-gray-700 hover:bg-green-800 hover:scale-105 hover:text-white transition flex flex-col items-center justify-center"
            >
              <img src="/rec.png" className="w-32 h-38 object-contain" />
              <div className="w-12 h-[1px] bg-white my-2"></div>
              <span className="font-semibold text-white text-center">
                Recipes
              </span>
            </a>
            <a
              href="/chatbot"
              className="w-46 p-6 hover:scale-105 border border-2xl  border-white bg-[radial-gradient(circle_at_center,rgba(0,0,255,0.7)_0%,rgba(31,29,29,0.9)_90%)] animate-spin-slow rounded-2xl border border-gray-700 hover:bg-green-800 hover:text-white transition flex flex-col items-center justify-center"
            >
              <img src="/calorie.png" className="w-32 h-38 object-contain" />
              <div className="w-12 h-[1px] bg-white my-2"></div>
              <span className="font-semibold text-white text-center">
                HealthBot
              </span>
            </a>

          </div>

          {/* Try These Out */}
<h2 className="text-2xl font-semibold text-center dark:text-black bg-gradient-to-r from-[#8a58ce] to-[#00CAFF] bg-clip-text text-transparent mt-12 mb-1">
  <br></br>Try These Out
</h2>

<div className="relative max-w-6xl mx-auto">
  {/* Left Arrow */}
  <button
    onClick={() => scroll(tryRef, "left")}
    className="absolute left-6 top-1/2 -translate-y-1/2 z-20 bg-gray-200 hover:bg-gray-300 p-2 rounded-full shadow"
  >
    <ChevronLeft className="w-5 h-5" />
  </button>

  {/* Scrollable Row */}
  
  <div
    ref={tryRef}
    className="flex space-x-6 overflow-x-auto scrollbar-hide scroll-smooth py-8 px-12"
  >
    {[
      { href: "/water-check", img: "/water.png", label: "Water Check" },
      { href: "/bmi", img: "/bmi.png", label: "BMI Calculator" },
      { href: "/exercises", img: "/yoga.png", label: "Exercises" },
      { href: "/sleep", img: "/sleep.png", label: "Sleep Tracker" },
      { href: "/sleepcal", img: "/bmi.png", label: "Sleep Calendar" },
    ].map((item, i) => (
      <a
  key={i}
  href={item.href}
  className={`min-w-[70%] sm:min-w-[40%] md:min-w-[30%] lg:min-w-[20%] 
    p-6 h-[200px] bg-[radial-gradient(circle_at_center,rgba(0,0,255,0.7)_0%,rgba(31,29,29,0.9)_90%)] 
    rounded-xl border border-gray-700 border border-white border-xl hover:bg-yellow-500 hover:text-white 
    transition-transform duration-500 flex flex-col items-center justify-center
    ${
      activeIndex === i
        ? "sm:scale-110 sm:shadow-xl sm:z-10" // only animate on sm and above
        : "sm:scale-100 sm:opacity-80"        // only affect larger screens
    }
  `}
>
  <img src={item.img} className="w-20 h-20 object-contain" />
  <div className="w-10 h-[1px] bg-white my-3"></div>
  <span className="font-medium text-white text-center text-sm">
    {item.label}
  </span>
</a>

    ))}
  </div>

  {/* Right Arrow */}
  <button
    onClick={() => scroll(tryRef, "right")}
    className="absolute right-7 top-1/2 -translate-y-1/2 z-20 bg-gray-200 hover:bg-gray-300 p-2 rounded-full shadow"
  >
    <ChevronRight className="w-5 h-5" />
  </button>
</div>

        

        {/* Sign Out */}
        <div className="flex justify-end mr-12 mt-12">
          <a
            href="/"
            onClick={async (e) => {
              e.preventDefault();
              await signOut(auth);
              window.location.href = "/auth/login";
            }}
            className="underline border bg-red-500 px-3 py-2 rounded-lg text-white hover:scale-105 hover:bg-red-600"
          >
            Sign out
          </a>
        </div>
      </main>
    </Protected>
  );
}