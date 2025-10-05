import { create } from "zustand";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut, // import signOut
} from "firebase/auth";

const googleProvider = new GoogleAuthProvider();

const useAuthStore = create((set) => ({
  user: null,
  loading: false,
  error: "",
  message: "",

  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setMessage: (message) => set({ message }),

  loginWithEmail: async (email, password) => {
    set({ loading: true, error: "", message: "" });
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await userCredential.user.reload();

      if (!userCredential.user.emailVerified) {
        await auth.signOut();
        set({ error: "Please verify your email before logging in." });
        return null;
      }

      set({ user: userCredential.user });
      return userCredential.user;
    } catch (err) {
      set({ error: err.message });
      return null;
    } finally {
      set({ loading: false });
    }
  },

  loginWithGoogle: async () => {
    set({ loading: true, error: "", message: "" });
    try {
      const result = await signInWithPopup(auth, googleProvider);

      if (!result.user.emailVerified) {
        await auth.signOut();
        set({ error: "Please verify your email before logging in." });
        return null;
      }

      set({ user: result.user });
      return result.user;
    } catch (err) {
      set({ error: err.message });
      return null;
    } finally {
      set({ loading: false });
    }
  },

  resetPassword: async (email) => {
    if (!email) {
      set({ error: "Please enter your email to reset password." });
      return;
    }
    set({ loading: true, error: "", message: "" });
    try {
      await sendPasswordResetEmail(auth, email);
      set({ message: "Password reset email sent! Check your inbox." });
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  signupWithEmail: async (email, password) => {
    set({ loading: true, error: "", message: "" });
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);
      set({ message: "Verification email sent! Please check your inbox." });
      return userCredential.user;
    } catch (err) {
      set({ error: err.message });
      return null;
    } finally {
      set({ loading: false });
    }
  },

  // ✅ Added logout function
  logout: async () => {
    set({ loading: true, error: "", message: "" });
    try {
      await signOut(auth);
      set({ user: null });
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },
}));

export default useAuthStore;
