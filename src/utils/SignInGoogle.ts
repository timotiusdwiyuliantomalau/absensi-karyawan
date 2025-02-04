import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { auth } from "../firebase/init";

// Create a provider instance
const provider = new GoogleAuthProvider();
export const handleGoogleSignIn = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log(user);
  } catch (error) {
    console.error("Error signing in:", error);
  }
};
export const handleSignOut = async () => {
  try {
    await signOut(auth);
    console.log("Successfully signed out");
    window.location.reload();
  } catch (error) {
    console.error("Error signing out:", error);
  }
};
