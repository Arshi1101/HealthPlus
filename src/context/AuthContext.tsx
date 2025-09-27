"use client";
import { doc, getDoc } from "firebase/firestore";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  User,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { db } from "@/lib/firebase"; // make sure you import Firestore
import {  setDoc, serverTimestamp } from "firebase/firestore";

type AppUser = User & { role?: string };

type AuthContextValue = {
  user: AppUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  signInEmail: (email: string, password: string) => Promise<void>;
  signUpEmail: (email: string, password: string, role?: string) => Promise<void>;
};


const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        const userDoc = await getDoc(doc(db, "users", u.uid));
        const userData = userDoc.exists() ? userDoc.data() : {};
        setUser({
          ...u,
          role: (userData as any)?.role || "user",
        } as AppUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading,
    signInWithGoogle: async () => {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    },
    signOutUser: async () => {
      await signOut(auth);
    },
    signInEmail: async (email, password) => {
      await signInWithEmailAndPassword(auth, email, password);
    },
    signUpEmail: async (email, password, role = "user") => {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
      await setDoc(doc(db, "users", uid), {
        email,
        role,
        createdAt: serverTimestamp(),
      });
    },
  }), [user, loading]);

  // ✅ THIS WAS MISSING
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}


export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}