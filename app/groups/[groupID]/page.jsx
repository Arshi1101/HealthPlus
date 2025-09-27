"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import InviteUserModal from "../../../components/InviteUserModal";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function GroupDashboardPage() {
  const { groupID } = useParams();
  const { user } = useAuth();
  const router = useRouter();

  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("leaderboard");

  useEffect(() => {
    if (!user || !groupID) return;

    const fetchGroup = async () => {
      try {
        const groupSnap = await getDoc(doc(db, "groups", groupID));
        if (!groupSnap.exists()) {
          setGroup(null);
          setLoading(false);
          return;
        }

        const groupData = groupSnap.data();

        // Permission check: only admin or members can view
        if (!groupData.members.includes(user.uid) && groupData.adminId !== user.uid) {
          alert("You do not have permission to view this group.");
          router.push("/team-dashboard");
          return;
        }

        // Fetch member details
        const membersDetailed = await Promise.all(
          (groupData.members || []).map(async (uid) => {
            const userSnap = await getDoc(doc(db, "users", uid));
            if (userSnap.exists()) {
              const data = userSnap.data();
              return {
                uid,
                username: data.username || data.email || "Unknown",
                email: data.email,
                points: data.points || 0,
                waterIntake: data.waterIntake || 0,
                calories: data.calories || 0,
                sleepHours: data.sleepHours || 0,
              };
            }
            return { uid, username: uid, email: uid, points: 0, waterIntake: 0, calories: 0, sleepHours: 0 };
          })
        );

        setGroup({ id: groupSnap.id, ...groupData, members: membersDetailed });
      } catch (err) {
        console.error("Error fetching group:", err);
        alert("Failed to load group.");
      } finally {
        setLoading(false);
      }
    };

    fetchGroup();
  }, [user, groupID]);

  if (!user)
    return (
      <div className="text-white min-h-screen flex items-center justify-center">
        Please login
      </div>
    );
  if (loading)
    return (
      <div className="text-white min-h-screen flex items-center justify-center">
        Loading group...
      </div>
    );
  if (!group)
    return (
      <div className="text-white min-h-screen flex items-center justify-center">
        Group not found!
      </div>
    );

  return (
    <div className="min-h-screen p-8 bg-gradient-to-b from-violet-900 via-black to-black text-white">
      <div className="bg-black/70 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-lg">
        {/* Header with Invite */}
        <div className="flex items-center justify-between mb-4 bg-white/5 backdrop-blur-sm p-3 rounded-xl">
          <div>
            <h2 className="text-2xl font-semibold">{group.name}</h2>
            <p className="text-gray-300 text-sm">Admin: {group.adminId}</p>
          </div>
          <InviteUserModal ownerId={group.adminId} groupID={group.id} />
        </div>

        {/* Toggle View */}
        <div className="flex items-center justify-center mb-6">
          <button
            onClick={() => setViewMode("leaderboard")}
            className={`px-4 py-2 rounded-l-xl ${
              viewMode === "leaderboard"
                ? "bg-green-600 text-white"
                : "bg-gray-700 text-gray-300"
            }`}
          >
            Leaderboard
          </button>
          <button
            onClick={() => setViewMode("stats")}
            className={`px-4 py-2 rounded-r-xl ${
              viewMode === "stats"
                ? "bg-green-600 text-white"
                : "bg-gray-700 text-gray-300"
            }`}
          >
            Health Stats
          </button>
        </div>

        {/* Leaderboard */}
        {viewMode === "leaderboard" && (
          <ul className="space-y-2">
            {group.members
              .sort((a, b) => b.points - a.points)
              .map((m, idx) => (
                <li
                  key={idx}
                  className="cursor-pointer hover:bg-white/10 rounded-lg px-3 py-2 flex justify-between"
                >
                  <span className="truncate max-w-[200px]">{m.username}</span>
                  <span className="font-bold text-green-400">{m.points} pts</span>
                </li>
              ))}
          </ul>
        )}

        {/* Stats */}
        {viewMode === "stats" && (
          <div className="grid gap-8">
            <ChartBox
              title="💧 Water Intake (liters/day)"
              data={group.members}
              dataKey="waterIntake"
              color="#38bdf8"
            />
            <ChartBox
              title="🍎 Nutrition (calories/day)"
              data={group.members}
              dataKey="calories"
              color="#f87171"
            />
            <ChartBox
              title="😴 Sleep (hours/night)"
              data={group.members}
              dataKey="sleepHours"
              color="#34d399"
            />
          </div>
        )}
      </div>
    </div>
  );
}

function ChartBox({ title, data, dataKey, color }) {
  return (
    <div className="bg-black/50 border border-yellow-700 p-4 rounded-lg">
      <h3 className="font-semibold mb-2">{title}</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ bottom: 50 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis
              dataKey="username"
              angle={-20}
              textAnchor="end"
              interval={0}
              height={40}
              tick={{ fill: "#fff", fontSize: 12 }}
            />
            <YAxis tick={{ fill: "#fff" }} />
            <Tooltip
              contentStyle={{ backgroundColor: "#222", border: "1px solid #666" }}
              labelStyle={{ color: "#fff" }}
            />
            <Bar dataKey={dataKey} fill={color} radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}