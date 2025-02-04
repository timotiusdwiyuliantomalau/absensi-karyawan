import { motion } from "framer-motion";
import { handleGoogleSignIn } from "../../utils/SignInGoogle";

export default function LoginPage() {
    return(
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#e7453a] to-[#dab455] text-white">
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.4,
            scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
          }}
        >
          <img
            src="./LOGO%20OFFICIAL.png"
            alt="logo-gg"
            width={200}
            height={200}
          />
        </motion.div>
        <motion.h1
          className="text-5xl font-bold mb-4 mt-8"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <img src="/gg" alt="" />
          GG Suspension
        </motion.h1>
        <motion.p
          className="text-lg text-center max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          Absensi Pegawai GG Suspension
        </motion.p>
        {/* <Link to="/home"> */}
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
    )
}