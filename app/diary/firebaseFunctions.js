import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "src/lib/firebase"; // make sure firebase.js is in the same folder

export const saveJournalEntry = async (entryId, entryData) => {
  try {
    await setDoc(doc(db, "journals", entryId), entryData);
    console.log("Entry saved!");
  } catch (error) {
    console.error("Error saving entry:", error);
  }
};

export const getJournalEntry = async (entryId) => {
  try {
    const docSnap = await getDoc(doc(db, "journals", entryId));
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    console.error("Error fetching entry:", error);
    return null;
  }
};

export const deleteJournalEntry = async (entryId) => {
  try {
    await deleteDoc(doc(db, "journals", entryId));
    console.log("Entry deleted!");
  } catch (error) {
    console.error("Error deleting entry:", error);
  }
};