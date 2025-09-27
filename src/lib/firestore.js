import { db } from "./firebase";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";

// Add a connection (invite)
export const addConnection = async (ownerId, viewerId, role = "admin") => {
  return await addDoc(collection(db, "connections"), {
    ownerId,
    viewerId,
    role,
  });
};

// List connections for a viewer/admin
export const getLinkedUsers = async (viewerId) => {
  const q = query(collection(db, "connections"), where("viewerId", "==", viewerId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// List viewers/admins for a user
export const getViewers = async (ownerId) => {
  const q = query(collection(db, "connections"), where("ownerId", "==", ownerId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};