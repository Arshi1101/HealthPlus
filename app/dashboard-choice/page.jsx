"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ThemeToggle from "../../components/ThemeToggle";
import TopMenuButton from "../../components/TopMenuButton"; 

export default function DashboardChoicePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [userGroups, setUserGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchUserRole = async () => {
      try {
        const groupsRef = collection(db, "groups");
        const q = query(groupsRef, where("adminId", "==", user.uid));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          setIsAdmin(true);
          setUserGroups(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }

        setLoading(false);
      } catch (err) {
        console.error("Error checking user role:", err);
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [user]);

  if (loading) return <div className="text-white min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <div className="text-white min-h-screen flex items-center justify-center">Please login to continue</div>;

  return (
    <div 
  className="min-h-screen flex items-center justify-center px-6 py-12 relative text-white"
  style={{
    background: `
      radial-gradient(circle at 20% 30%, rgba(255,105,180,0.25) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(138,58,206,0.25) 0%, transparent 50%),
      radial-gradient(circle at 50% 80%, rgba(0,202,255,0.2) 0%, transparent 40%),
      linear-gradient(to bottom, #0a0014 0%, #000000 100%)
    `
  }}
>
      {/* Top Buttons */}
      <TopMenuButton />
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        
        {/* Team Dashboard Card */}
        <div
          onClick={() => {
            if (userGroups.length > 0) router.push(`/groups/${userGroups[0].id}`);
            else router.push("/team-dashboard");
          }}
          className="cursor-pointer bg-gradient-to-br from-[#111111] to-[#1a1a1a] border border-cyan-500/50 backdrop-blur-md rounded-2xl shadow-lg p-10 flex flex-col items-center justify-center hover:scale-[1.04] hover:border-[#00CAFF] transition-transform duration-300"
        >
          <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-[#8a58ce] to-[#00CAFF] bg-clip-text text-transparent shadow-md">
            Team Dashboard
          </h2>
          <p className="text-gray-300 text-center">View your group info, members, and shared logs</p>
        </div>

        {/* Your Dashboard Card */}
        <div
          onClick={() => router.push("/dashboard")}
          className="cursor-pointer bg-gradient-to-br from-[#111111] to-[#1a1a1a] border  border-cyan-500/50 backdrop-blur-md rounded-2xl shadow-lg p-10 flex flex-col items-center justify-center hover:scale-[1.04] hover:border-[#00CAFF] transition-transform duration-300"
        >
          <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-[#8a58ce] to-[#00CAFF] bg-clip-text text-transparent shadow-md">
            Your Dashboard
          </h2>
          <p className="text-gray-300 text-center">View your personal logs, progress, and insights</p>
        </div>
      </div>
    </div>
  );
}