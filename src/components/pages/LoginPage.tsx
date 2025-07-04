import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "../../../slice/store";
import { LoadingElement } from "../ui/LoadingElement";
import { useEffect } from "react";
import { handleLogin } from "../../utils/auth";

export default function LoginPage() {
  const isLoading = useSelector((state: RootState) => state.slice.isLoading);

  function handleSubmit(e: any) {
    e.preventDefault();
    handleLogin(e.target.kode.value);
  }
  
  useEffect(() => {
  }, []);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[rgb(245,72,14)] to-[#ee910f] text-white">
      {isLoading && <LoadingElement />}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.4,
          scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
        }}
      >
        <span className="shadow-xl rounded-full flex items-center justify-center">
          <img
            src="./LOGO%20OFFICIAL.png"
            alt="logo-gg"
            width={200}
            height={200}
          />
        </span>
      </motion.div>
      <motion.h1
        className="text-4xl mt-8 text-yellow-300 font-bold text-center p-3 mb-2"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Absensi Karyawan
      </motion.h1>
      <motion.form
        onSubmit={(e) => handleSubmit(e)}
        className="flex flex-col gap-1"
      >
        <motion.div className="grid gap-1">
          <motion.label className="text-xl font-semibold">
            Kode Karyawan :{" "}
          </motion.label>
          <motion.input name="kode" type="text" pattern="[0-9]{8}" className="px-4 rounded-xl bg-white/10 backdrop-blur-lg shadow-lg border border-white/20 text-white font-semibold text-lg transition-transform transform hover:scale-105 active:scale-95 w-fit"></motion.input>
        </motion.div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="flex justify-center gap-3 items-center px-6 rounded-xl bg-white/20 backdrop-blur-lg shadow-lg border border-white/20 text-white font-semibold text-lg transition-transform transform hover:scale-105 active:scale-95 mt-4 py-1"
        >
          <p>LOGIN</p>
        </motion.button>
      </motion.form>
    </div>
  );
}
