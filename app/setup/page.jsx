"use client";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { db, auth } from "@/lib/firebase";
import ThemeToggle from "components/ThemeToggle";

export default function SetupPage() {
  const router = useRouter();
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!gender || !age) {
      alert("Please select your gender and age");
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        alert("User not logged in");
        return;
      }

      await setDoc(
        doc(db, "users", user.uid),
        { gender, age, email: user.email },
        { merge: true }
      );

      const userDoc = await getDoc(doc(db, "users", user.uid));
      const role = userDoc?.data()?.role;
      if (role === "admin") router.push("/create-group");
      else router.push("/dashboard-choice");

    } catch (error) {
      console.error("Error saving setup:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <main className="relative w-screen min-h-screen flex justify-center items-center px-6 sm:px-12 bg-black text-white">
      {/* Theme Toggle */}
      <div className="absolute top-4 left-4 z-50">
        <ThemeToggle />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 w-full max-w-6xl">
        {/* Optional Animation/Illustration */}
        <div className="hidden lg:flex justify-center w-full h-full">
          <div className="loading">
            <div className="loading-wide">
              <div className="l1 color"></div>
              <div className="l2 color"></div>
              <div className="e1 color animation-effect-light"></div>
              <div className="e2 color animation-effect-light-d"></div>
              <div className="e3 animation-effect-rot">X</div>
              <div className="e4 color animation-effect-light"></div>
              <div className="e5 color animation-effect-light-d"></div>
              <div className="e6 animation-effect-scale">*</div>
              <div className="e7 color"></div>
              <div className="e8 color"></div>
            </div>
          </div>
        </div>

        {/* Setup Form */}
        <div className="flex justify-center">
          <div className="w-full max-w-md rounded-2xl bg-gradient-to-br from-[#111111] to-[#1a1a1a] border border-white/10 shadow-lg hover:shadow-xl hover:border-[#00CAFF] backdrop-blur-md p-8 transition duration-300">
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-[#8a58ce] to-[#00CAFF] bg-clip-text text-transparent">
              Complete Your Setup
            </h1>
            <p className="text-gray-300 mb-6 text-sm">
              Tell us about yourself so we can personalize your experience.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Gender */}
              <div>
                <label className="block text-gray-200 font-medium mb-2">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full rounded-lg border border-gray-700 bg-[#111111] text-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#8a58ce] transition"
                  required
                >
                  <option value="">Select your gender</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Age */}
              <div>
                <label className="block text-gray-200 font-medium mb-2">Age</label>
                <input
                  type="number"
                  min="10"
                  max="120"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Enter your age"
                  className="w-full rounded-lg border border-gray-700 bg-[#111111] text-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#8a58ce] transition"
                  required
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-[#8a58ce] to-[#00CAFF] text-black font-semibold px-4 py-2 shadow-lg hover:opacity-90 transition"
              >
                Continue
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}