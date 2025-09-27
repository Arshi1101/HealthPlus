"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

export default function JoinGroupPage() {
  const { groupID } = useParams();
  const { user } = useAuth();
  const router = useRouter();

  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    const fetchGroup = async () => {
      const snap = await getDoc(doc(db, "groups", groupID));
      if (snap.exists()) {
        setGroup({ id: snap.id, ...snap.data() });
      }
      setLoading(false);
    };
    fetchGroup();
  }, [groupID]);

  const handleJoin = async () => {
  if (!user) {
    router.push("/login");
    return;
  }

  setJoining(true);
  const groupRef = doc(db, "groups", groupID);

  try {
    await updateDoc(groupRef, {
      members: arrayUnion(user.uid),
    });
    router.push(`/groups/${groupID}`);
  } catch (err) {
    console.error("Error joining group:", err);
    alert("Failed to join the group. Please try again.");
  } finally {
    setJoining(false);
  }
};


  if (loading) return <p className="text-center mt-10">Loading team info...</p>;
  if (!group) return <p className="text-center mt-10">Team not found!</p>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="max-w-md w-full p-6 bg-white rounded-2xl shadow-xl">
        <h2 className="text-xl font-bold text-center mb-4">Join Team</h2>
        <p className="text-center mb-6">
          You are about to join <span className="font-semibold">{group.name}</span>.
        </p>
        <button
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          onClick={handleJoin}
          disabled={joining}
        >
          {joining ? "Joining..." : "Join Team"}
        </button>
      </div>
    </div>
  );
}