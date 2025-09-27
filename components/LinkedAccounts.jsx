"use client";
import { useEffect, useState } from "react";
import { getLinkedUsers } from "@/lib/firestore";
import { useAuth } from "@/context/AuthContext";

export default function LinkedAccounts() {
  const { user } = useAuth();
  const [linkedUsers, setLinkedUsers] = useState([]);

  useEffect(() => {
    if (!user) return;
    const fetchLinked = async () => {
      const data = await getLinkedUsers(user.uid);
      setLinkedUsers(data);
    };
    fetchLinked();
  }, [user]);

  return (
    <div className="p-4 border rounded">
      <h3>Connected Users</h3>
      <ul>
        {linkedUsers.length === 0 && <li>No connections yet</li>}
        {linkedUsers.map((conn) => (
          <li key={conn.id}>
            {conn.viewerId} - Role: {conn.role}
          </li>
        ))}
      </ul>
    </div>
  );
}