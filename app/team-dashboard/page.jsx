"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, updateDoc, arrayUnion, collection, query, where, getDocs, getDoc } from "firebase/firestore";

export default function TeamDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [joinLink, setJoinLink] = useState("");
  const [joining, setJoining] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!user) return;

    const checkUserRole = async () => {
      try {
        // Check if user is admin
        const adminQuery = query(collection(db, "groups"), where("adminId", "==", user.uid));
        const adminSnap = await getDocs(adminQuery);
        if (!adminSnap.empty) {
          setIsAdmin(true);
          // Admin already has a team → redirect to their group
          router.push(`/groups/${adminSnap.docs[0].id}`);
          return;
        }

        // Check if user already belongs to a team
        const userQuery = query(collection(db, "groups"), where("members", "array-contains", user.uid));
        const userSnap = await getDocs(userQuery);
        if (!userSnap.empty) {
          // User already joined a team → redirect to that group
          router.push(`/groups/${userSnap.docs[0].id}`);
          return;
        }

        // If admin with no team → redirect to create group
        // If normal user with no team → stay here to join
      } catch (err) {
        console.error("Error checking groups:", err);
      } finally {
        setLoading(false);
      }
    };

    checkUserRole();
  }, [user]);

  const handleJoinTeam = async () => {
  if (!joinLink) return;

  const parts = joinLink.split("/");
  const groupID = parts[parts.length - 1];

  setJoining(true);
  try {
    const groupRef = doc(db, "groups", groupID);

    // Fetch current members
    const groupSnap = await getDoc(groupRef);
    if (!groupSnap.exists()) {
      alert("Group not found!");
      setJoining(false);
      return;
    }

    const groupData = groupSnap.data();
    const currentMembers = groupData.members || [];

    // Check if user already in members
    if (currentMembers.includes(user.uid)) {
      router.push(`/groups/${groupID}`);
      return;
    }

    // Append current user UID
    const updatedMembers = [...currentMembers, user.uid];

    // Update Firestore
    await updateDoc(groupRef, { members: updatedMembers });

    router.push(`/groups/${groupID}`);
  } catch (err) {
    console.error("Error joining team:", err);
    alert("Failed to join the team. Please check the link.");
  } finally {
    setJoining(false);
  }
};


  if (!user) return <div className="text-white min-h-screen flex items-center justify-center">Please login</div>;
  if (loading) return <div className="text-white min-h-screen flex items-center justify-center">Loading...</div>;

  // Admins should not see this page if they have no team (they are redirected)
  if (isAdmin) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-violet-900 via-black to-black text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Join a Team</h1>

      <div className="max-w-md w-full bg-black/70 p-6 rounded-xl backdrop-blur-md">
        <p className="mb-4 text-center text-gray-300">
          You are not part of any team yet. Paste your team link below to join a team:
        </p>
        <input
          type="text"
          placeholder="Paste team link here"
          value={joinLink}
          onChange={(e) => setJoinLink(e.target.value)}
          className="w-full px-4 py-2 mb-4 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          onClick={handleJoinTeam}
          disabled={joining}
          className="w-full py-2 bg-green-600 rounded-lg hover:bg-green-700 transition"
        >
          {joining ? "Joining..." : "Join Team"}
        </button>
      </div>
    </div>
  );
}