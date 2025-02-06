import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { auth } from "../firebase/init";

// Create a provider instance
const provider = new GoogleAuthProvider();
export const handleGoogleRegister = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    user && localStorage.setItem("email", JSON.stringify(user.email));
    if (user) window.location.href = "/#/register-form";
  } catch (error) {
    console.error("Error signing in:", error);
  }
};

export const handleGoogleSignIn = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    return user;
    
  } catch (error) {
    console.error("Error signing in:", error);
  }
};

export const handleSignOut = async () => {
  try {
    await signOut(auth);
    window.location.reload();
  } catch (error) {
    console.error("Error signing out:", error);
  }
};
