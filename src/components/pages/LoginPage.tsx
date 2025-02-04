import { motion } from "framer-motion";
import { handleGoogleSignIn } from "../../utils/SignInGoogle";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#ed6437] to-[#dab455] text-white">
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.4,
          scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
        }}
      >
        <span className="bg-white p-3 rounded-full flex items-center justify-center">
        <img
          src="./LOGO%20OFFICIAL.png"
          alt="logo-gg"
          width={200}
          height={200}
        />
        </span>
      </motion.div>
      <motion.h1
        className="text-5xl mb-4 mt-8 text-black font-bold"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        GG SUSPENSION
      </motion.h1>
      <motion.p
        className="text-xl text-center max-w-md mb-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        Absensi Pegawai GG Suspension
      </motion.p>
      {/* <Link to="/register"> */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="flex gap-3 items-center px-6 py-2 rounded-xl bg-white/10 backdrop-blur-lg shadow-lg border border-white/20 text-white font-semibold text-lg transition-transform transform hover:scale-105 active:scale-95 mt-2"
        onClick={handleGoogleSignIn}
      >
        <p>REGISTER</p>
        <img src="/LOGO%20GOOGLE.png" alt="" className="w-5" />
      </motion.button>
      {/* </Link> */}
    </div>
  );
}
