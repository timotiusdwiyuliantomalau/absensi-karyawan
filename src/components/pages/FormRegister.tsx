import { useState } from "react";
import { handleAddKaryawan } from "../../firebase/service";
import { LoadingElement } from "../ui/LoadingElement";
import Swal from "sweetalert2";

const FormRegister = () => {
  const emailUser = JSON.parse(localStorage.getItem("email") || "");
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    nama: "",
    gerai: "",
    divisi: "",
    email: emailUser,
  });

  const handleSubmit = (e: any) => {
    setIsSubmit(true);
    e.preventDefault();
    handleAddKaryawan(formData).then(() => {
      setIsSubmit(false);
      Swal.fire("Berhasil", "Data Anda berhasil terdaftar", "success");
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e9d712] to-[#d38508]">
      {isSubmit && (
        <div className="h-full w-full fixed z-10 bg-black opacity-70">
          <LoadingElement></LoadingElement>
        </div>
      )}
      <div className="glass-container bg-white backdrop-blur-lg rounded-2xl p-8 md:p-10 shadow-2xl border border-white/20 w-full max-w-md mx-4">
        <h1 className="text-black text-2xl md:text-3xl font-bold text-center mb-8 drop-shadow-md">
          Daftar Karyawan
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              disabled
              className="w-full px-4 py-3 bg-slate-100 backdrop-blur-sm rounded-lg border border-white/20 placeholder:text-black/70 text-black focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
              value={formData.email}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Nama Lengkap"
              required
              className="w-full px-4 py-3 bg-slate-100 backdrop-blur-sm rounded-lg border border-white/20 placeholder:text-black/70 text-black focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
              value={formData.nama}
              onChange={(e) =>
                setFormData({ ...formData, nama: e.target.value })
              }
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Jabatan"
              required
              className="w-full px-4 py-3 bg-slate-100 backdrop-blur-sm rounded-lg border border-white/20 placeholder:text-black/70 text-black focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
              value={formData.divisi}
              onChange={(e) =>
                setFormData({ ...formData, divisi: e.target.value })
              }
            />
          </div>

          <div>
            <select
              required
              className="w-full px-4 py-3 bg-slate-100 backdrop-blur-sm rounded-lg border border-white/20 text-black focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent appearance-none transition-all"
              value={formData.gerai}
              onChange={(e) =>
                setFormData({ ...formData, gerai: e.target.value })
              }
            >
              <option value="" disabled className="bg-white text-black">
                Pilih Gerai
              </option>
              <option value="BEKASI" className="bg-white text-black">
                BEKASI (PUSAT)
              </option>
              <option value="TANGERANG" className="bg-white text-black">
                TANGERANG
              </option>
              <option value="DEPOK" className="bg-white text-black">
                DEPOK
              </option>
              <option value="JAKTIM" className="bg-white text-black">
                JAKTIM
              </option>
              <option value="CIKARANG" className="bg-white text-black">
                CIKARANG
              </option>
              <option value="BOGOR" className="bg-white text-black">
                BOGOR
              </option>
              <option value="JAKSEL" className="bg-white text-black">
                JAKSEL
              </option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-orange-400 text-white font-bold rounded-lg transition-all duration-300 uppercase tracking-wider cursor-pointer"
          >
            Daftar
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormRegister;
