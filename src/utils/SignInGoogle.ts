import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { auth } from "../firebase/init";
import { getPersonalKaryawan } from "../firebase/service";
import { setCookie } from "./cookies";
import Swal from "sweetalert2";

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
    getPersonalKaryawan(user.email).then((data:any) => {
      data.email?setCookie("myData", JSON.stringify(data)):Swal.fire({
        icon: "error",
        title: "Email Tidak Terdaftar",
        text: "Gunakan email yang sudah terdaftar sebelumnya!",
      });;
    });
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
