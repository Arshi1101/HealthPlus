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
        // Check if user is admin of any group
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

  const handleTeamDashboard = () => {
    if (isAdmin && userGroups.length > 0) {
      // Navigate to the first admin group page (or show selection later)
      router.push(`/groups/${userGroups[0].id}`);
    } 
  };

  const handleYourDashboard = () => {
    router.push("/user-dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-600 to-yellow-600 flex items-center justify-center p-6">
      <TopMenuButton />
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {/* Team Dashboard Card */}
        <div 
          onClick={() => {
  if (userGroups.length > 0) {
    router.push(`/groups/${userGroups[0].id}`);
  } else {
    router.push("/team-dashboard"); // show join/create
  }
}}


          className="cursor-pointer bg-yellow-500/10 backdrop-blur-md border border-xl border-white/30 rounded-2xl shadow-lg p-10 flex flex-col items-center justify-center hover:scale-105 transition"
        >
          <h2 className="text-2xl font-bold mb-4 shadow-lg shadow-yellow-600/50 text-white">Team Dashboard</h2>
          <p className="text-white text-center">View your group info, members, and shared logs</p>
        </div>

        {/* Your Dashboard Card */}
        <div 
          onClick={() => router.push("/dashboard")}
          className="cursor-pointer bg-yellow-500/10 backdrop-blur-md border border-white/30 rounded-2xl shadow-lg p-10 flex flex-col items-center justify-center hover:scale-105 transition"
        >
          <h2 className="text-2xl shadow-lg shadow-yellow-600/50 font-bold mb-4 text-white">Your Dashboard</h2>
          <p className="text-white text-center">View your personal logs, progress, and insights</p>
        </div>
      </div>
    </div>
  );
}