import { FaUsers, FaCalendarAlt, FaCalendar, FaClock } from "react-icons/fa";
import Camera from "../fragments/Camera";
import { useState } from "react";
import Location from "../fragments/Location";
import { handleSubmitAbsensi } from "../../firebase/service";
import Swal from "sweetalert2";
import { LoadingElement } from "../ui/LoadingElement";
import { Link } from "react-router-dom";

const Home = () => {
  const [selfieImage, setSelfieImage] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [isCamera,setIsCamera]=useState<boolean>(false);

  const handleCapture = (image: string) => {
    setSelfieImage(image);
    if(location.length===0) return alert("ALAMAT BELUM TERDETEKSI! NYALAKAN GPS ANDA TERLEBIH DAHULU!");
    const date = new Date();
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;
    let currentTime = new Date().toLocaleTimeString('en-GB', { hour12: false });
    setIsSubmit(true);
    handleSubmitAbsensi(
      "absensi-pegawai-bekasi",
      [{ nama: "John Doe", alamat: location, jabatan: "IT Developer",waktu:currentTime }],
      formattedDate
    ).then((res: any) => {
      setIsSubmit(false);
      res && Swal.fire("Berhasil", "Anda telah absen!", "success");
      setIsCamera(false);
    });
  };

  

  const handleLocationUpdate = (address: string) => {
    setLocation(address);
  };

  return (
    <div className="bg-gray-100 font-roboto min-h-screen">
      {isSubmit && (
        <div className="h-full w-full fixed z-10 bg-black opacity-70">
          <LoadingElement></LoadingElement>
        </div>
      )}
      <div className="bg-indigo-900 text-white px-5 pt-4 pb-7 rounded-b-3xl">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <img
              src="./LOGO%20OFFICIAL.png"
              alt="Logo"
              className="w-10 h-10"
            />
            <span className="ml-2 text-xl font-bold">Absensi Pegawai</span>
          </div>
          <i className="fas fa-bell"></i>
        </div>
        <div className="flex items-center mt-4">
          <img
            src="https://storage.googleapis.com/a1aa/image/G8zbMvUB-qpJk7jO7mBu7igEtjdvcaO2xkI2KThBAkk.jpg"
            alt="User profile"
            className="w-12 h-12 rounded-full"
          />
          <div className="ml-4">
            <div className="text-lg font-semibold">John Doe</div>
            <div className="text-sm">UI/UX Designer</div>
          </div>
          <div className="ml-auto text-right">
            <div className="text-lg font-semibold">09:50 WIB</div>
            <div className="text-sm">Jumat 12 Februari 2023</div>
          </div>
        </div>
        <div className="mt-4 flex justify-center">
          <button onClick={()=>setIsCamera(true)} className="bg-pink-500 text-white py-2 px-6 rounded-full text-lg font-semibold">
            Absensi Kehadiran
          </button>
        </div>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-4 gap-4 text-center text-pink-500 mb-5">
          {[
            { icon: <FaUsers />, text: "Daftar Karyawan" },
            { icon: <FaCalendarAlt />, text: "Izin Cuti" },
            { icon: <FaCalendar />, text: "Kalender" },
            { icon: <FaClock />, text: "Lembur" },
          ].map((item, index) => (
            <Link to={"/daftar-karyawan"} key={index}>
              <div className="flex justify-center text-2xl">{item.icon}</div>
              <div className="mt-2 text-sm">{item.text}</div>
            </Link>
          ))}
        </div>
        <Location onLocationUpdate={handleLocationUpdate} />
        {isCamera&&<Camera onCapture={handleCapture}></Camera>}
        {selfieImage && (
          <img
            src={selfieImage}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg"
          />
        )}
      </div>
    </div>
  );
};

export default Home;
