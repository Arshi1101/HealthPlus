'use client';
import Link from "next/link";
import ThemeToggle from "../components/ThemeToggle";

export default function Navbar() {
  return (
    <>
      {/* Header / Navbar */}
      <header className="top-5 w-full z-20">
        <nav className="flex flex-col sm:flex-row justify-between items-center max-w-4.5xl mx-auto px-4 sm:px-8 py-3 gap-3 sm:gap-0">
          
          {/* Left: Logo */}
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-xl font-extrabold text-green-500 hover:text-green-400 hover:scale-105 transition text-center"
            >
              <span className="font-extrabold text-4xl mr-6 bg-gradient-to-r from-[#8a58ce] to-[#00CAFF] bg-clip-text text-transparent">
  +
</span>

              HealthPlus
            </Link>
          </div>

          {/* Right: Nav Links + Theme Toggle */}
          <div className="flex items-center gap-6">
            {/* Nav Links */}
            <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-10 text-sm sm:text-base font-semibold items-center">
              <a
                href="#about"
                className="hover:text-green-400 dark:text-black button bg-white/10 rounded-2xl border px-6 py-1 text-black font-bold transition hover:scale-105 duration-300"
              >
                About us
              </a>
              <Link
                href="#contact"
                className="hover:text-green-400 button font-bold transition dark:text-black text-black duration-300 bg-white/10 rounded-2xl border px-6 py-1 shadow-sm hover:scale-105"
              >
                Contact Us
              </Link>
              <Link
                href="#services"
                className="hover:text-green-400 button bg-white/10 dark:text-black rounded-2xl border px-6 py-1 text-black font-bold transition hover:scale-105 duration-300"
              >
                Services
              </Link>
            </div>

            {/* Theme Toggle */}
            <ThemeToggle />
          </div>

        </nav>
      </header>


      {/* Hero / Main Section */}
      <main className="h-screen flex flex-col md:flex-row items-center justify-center gap-x-28 overflow-x-hidden bg-blue dark:bg-violet-100 px-6 sm:px-12">
        <div className="flex flex-col flex-grow max-w-4xl justify-center">
          <h1 className="text-4xl sm:text-7xl mb-5 font-bold mt-6 bg-gradient-to-r from-[#8a58ce] to-[#00CAFF] bg-clip-text text-transparent text-center md:text-left">
            YOUR HEALTH IS OUR{" "}
            <br />
            <span className="text-[#00CAFF] text-6xl sm:text-7xl">
              {"PRIORITY".split("").map((letter, i) => (
                <span key={i} className="hover:opacity-0 inline-block">
                  {letter}
                </span>
              ))}
            </span>
            .
          </h1>

          <p className="mt-8 text-white text-left dark:text-black max-w-2xl text-[1.2rem] sm:text-[1.4rem]">
            Personalized diets, continuous monitoring, and intelligent food
            recommendations. Take control of your health journey today!
          </p>

          <Link href="/auth/signup">
            <button className="mt-10 w-full sm:w-1/4 mx-auto sm:mx-0 block animated-button">
              <svg
                viewBox="0 0 24 24"
                className="arr-2"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
              </svg>
              <span className="text">Get started</span>
              <span className="circle"></span>
              <svg
                viewBox="0 0 24 24"
                className="arr-1"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
              </svg>
            </button>
          </Link>
        </div>

        {/* DNA */}
        <div className="dna hidden mr-12 items-start justify-left md:block max-w-[320px] mt-5 hover:opacity-70">
          {[...Array(16)].map((_, i) => (
            <div key={i} className="link">
              <div></div>
              <div></div>
            </div>
          ))}
        </div>
      </main>

      {/* About Us Section */}
      <section
        id="about"
        className="min-h-screen flex flex-col justify-center items-center px-6 sm:px-12 py-20 bg-blue dark:bg-violet-300 dark:from-violet-500 dark:to-pink-500"
      >
        <h2 className="text-4xl font-bold text-white dark:text-gray-900 mb-6">
          About Us<span className="text-cyan-500">.</span>
        </h2>

        <p className="max-w-3xl text-lg text-white font-bold dark:text-gray-800 leading-relaxed text-center">
          <div className="border-t border-purple mt-5 mb-5"></div>
          At <span className="text-cyan-500">HealthPlus</span>, we are dedicated
          to empowering you to take control of your health journey. Our platform
          offers personalized diet plans, continuous monitoring, and intelligent
          food recommendations, all designed to help you achieve your wellness
          goals. Whether a beginner, homemaker, or health enthusiast,
          HealthPlus offers a seamless, accessible experience for everyone on
          their wellness journey. Your health is our priority, and we are here
          to support you every step of the way.
        </p>
      </section>

      {/* Services Section */}
      <section
        id="services"
        className="relative min-h-screen flex flex-col justify-center items-center px-6 sm:px-12 py-20 bg-black text-white"
      >
        <h2 className="text-4xl font-bold mb-16 bg-gradient-to-r from-[#8a58ce] to-[#00CAFF] bg-clip-text text-transparent">
          Our Services
        </h2>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl w-full">
          {[
            {
              icon: "🥗",
              title: "Know Your Food",
              desc: "Instantly analyze the nutritional value of any food item to make informed choices for a healthier lifestyle.",
            },
            {
              icon: "📅",
              title: "Nutrition Calendar",
              desc: "Track your monthly nutrition intake and visualize your eating patterns to support holistic wellness.",
            },
            {
              icon: "👩‍🍳",
              title: "Recipes",
              desc: "Discover healthy, easy-to-cook recipes with a complete nutritional breakdown, personalized to your preferences.",
            },
            {
              icon: "💧",
              title: "Water Checker",
              desc: "Stay hydrated by monitoring your daily water intake and receiving timely reminders.",
            },
            {
              icon: "⚖️",
              title: "BMI Calculator",
              desc: "Quickly calculate your Body Mass Index and get personalized insights for your fitness journey.",
            },
            {
              icon: "😴",
              title: "Sleep Tracker",
              desc: "Monitor your sleep patterns and log daily rest data to improve sleep quality and overall well-being.",
            },
            {
              icon: "🌙",
              title: "Sleep Calendar",
              desc: "Visualize your sleep trends over time and identify opportunities to build better sleep habits.",
            },
          ].map((svc, idx) => {
            const isSpanAll = svc.title === "Sleep Calendar";
            return (
              <div
                key={idx}
                className={`p-8 rounded-2xl bg-gradient-to-br from-[#111111] to-[#1a1a1a] border border-white/10 shadow-lg hover:shadow-xl hover:border-[#00CAFF] transition duration-300 hover:scale-[1.03] ${
                  isSpanAll ? "sm:col-span-2 lg:col-span-3" : ""
                }`}
              >
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                  <span>{svc.icon}</span>
                  <span className="bg-gradient-to-r from-[#8a58ce] to-[#00CAFF] bg-clip-text text-transparent">
                    {svc.title}
                  </span>
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {svc.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
