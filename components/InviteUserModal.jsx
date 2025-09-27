"use client";

import { useState } from "react";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function InviteUserModal({ ownerId, groupID }) {
  const [status, setStatus] = useState("");

  // Generate team join link
  const teamLink = `${window.location.origin}/groups/join/${groupID}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(teamLink);
      setStatus("Link copied to clipboard!");
    } catch (err) {
      console.error(err);
      setStatus("Failed to copy link.");
    }
  };

  return (
    <div className="p-4 border rounded bg-black/70 backdrop-blur-md">
      <h3 className="text-lg font-semibold mb-2">Invite Team Members</h3>

      <p className="mb-2 text-sm">
        Share this link to let anyone join your group:
      </p>

      <div className="flex items-center mb-2">
        <input
          type="text"
          readOnly
          value={teamLink}
          className="flex-1 px-2 py-1 rounded text-black"
        />
        <button
          onClick={handleCopyLink}
          className="ml-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
        >
          Copy
        </button>
      </div>

      {status && <p className="text-sm text-green-400">{status}</p>}
    </div>
  );
}