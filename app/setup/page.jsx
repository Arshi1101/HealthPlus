"use client";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { db, auth } from "@/lib/firebase";
import ThemeToggle from "components/ThemeToggle";
import { getDoc } from "firebase/firestore"; // <-- add getDoc

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

      // Save gender & age to Firestore
      console.log("Current user:", user?.uid, user?.email);
      await setDoc(
        doc(db, "users", user.uid),
        { gender, age, email: user.email },
        { merge: true } // merge ensures we don’t overwrite existing fields
      );

      console.log("User setup saved:", { gender, age });

      const userDoc = await getDoc(doc(db, "users", user.uid));
const role = userDoc?.data()?.role;
if(role === "admin") router.push("/create-group");
else router.push("/dashboard-choice");


    } catch (error) {
      console.error("Error saving setup:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <main className="flex min-h-screen dark:bg-violet-200 items-center justify-center px-6 ">
      <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-8 w-full max-w-6xl">
        <div className="absolute top-4 left-4 z-50">
  <ThemeToggle />
</div>
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

        {/* Setup form */}
        <div className="flex justify-center">
          <div className="w-full max-w-md rounded-2xl dark:bg-black/80 bg-white/10 border border-green-500 p-8 shadow-lg backdrop-blur">
            <h1 className="text-2xl font-bold text-green-100">Complete Your Setup</h1>
            <p className="mt-2 text-gray-100">
              Tell us about yourself so we can personalize your experience.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
              {/* Gender */}
              <div>
                <label className="block text-green-100 font-medium">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring focus:ring-green-200"
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
                <label className="block text-green-100 font-medium">Age</label>
                <input
                  type="number"
                  min="10"
                  max="120"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring focus:ring-green-200"
                  placeholder="Enter your age"
                  required
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full rounded-xl bg-green-600 px-4 py-2 text-white font-semibold hover:bg-green-700 transition"
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