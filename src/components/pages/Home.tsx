import { FaUsers, FaCalendarAlt, FaCalendar, FaClock } from "react-icons/fa";
import Camera from "../fragments/Camera";
import { useEffect, useState } from "react";
import Location from "../fragments/Location";
import { getDataAbsensi, handleSubmitAbsensi } from "../../firebase/service";
import Swal from "sweetalert2";
import { LoadingElement } from "../ui/LoadingElement";
import { Link } from "react-router-dom";
import { getCookie } from "../../utils/cookies";
import { MdAccountCircle } from "react-icons/md";
import LoadingRefresh from "../ui/LoadingRefresh";
import { tanggalHariIni } from "../../utils/tanggalSekarang";

const Home = () => {
  // const [selfieImage, setSelfieImage] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [isCamera, setIsCamera] = useState<boolean>(false);
  const [myProfile, setMyProfile] = useState<any>(null);
  const [dataAbsensiSemuaKaryawan, setDataAbsensiSemuaKaryawan] =
    useState<any>(undefined);
  const [hasAbsent, setHasAbsent] = useState<boolean>(true);
  const jamPulang = "17:00:00";
  const date = new Date();
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const formattedDate = `${day}-${month}-${year}`;
  let currentTime = new Date().toLocaleTimeString("en-GB", { hour12: false });

  const handleCapture = () => {
    if (location.length == 0)
      return alert(
        "ALAMAT BELUM TERDETEKSI! NYALAKAN GPS ANDA TERLEBIH DAHULU!"
      );
      
    handleSubmitAbsensi(
      "absensi-pegawai-bekasi",
      { ...myProfile, alamat: location, waktu: currentTime },
      formattedDate
    ).then((res: any) => {
      setDataAbsensiSemuaKaryawan(res);
      setIsSubmit(false);
      Swal.fire("Berhasil", "Anda telah absen!", "success");
      setIsCamera(false);
      setDataAbsensiSemuaKaryawan([]);
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    });
  };

  useEffect(() => {
    const result = getCookie("myData");
    setMyProfile(JSON.parse(result || ""));
    getDataAbsensi(formattedDate).then((res: any) => {
      const dataAbsensi = res.data.filter(
        (data: any) => result && data.email == JSON.parse(result).email
      );
      if(dataAbsensi.length<1) return setHasAbsent(false);
      setDataAbsensiSemuaKaryawan(dataAbsensi);
      if (dataAbsensi.length < 2) {
        currentTime >= jamPulang && setHasAbsent(false);
        dataAbsensi.length == 1 &&
          dataAbsensi[0].waktu <= jamPulang &&
          setHasAbsent(true);
      } else {
        setHasAbsent(true);
      }
    });
  }, []);

  const handleLocationUpdate = (address: string) => {
    setLocation(address);
  };

  return (
    <div className="bg-gray-200 font-roboto min-h-screen">
      {isSubmit && <LoadingElement></LoadingElement>}
      <div className="bg-orange-500 text-white px-5 pt-4 pb-7 rounded-b-3xl">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="p-[0.1em] bg-white rounded-full">
            <img src="./LOGO%20OFFICIAL.png" alt="Logo" className="w-8" />
            </span>
            <span className="ml-2 text-md font-bold text-black">
              Absensi Pegawai GG Suspension
            </span>
          </div>
          <i className="fas fa-bell"></i>
        </div>
        <div className="flex items-center mt-4 gap-2 text-white">
          <MdAccountCircle className="text-7xl"></MdAccountCircle>
          <div>
            <div className="text-lg font-extrabold">
              {myProfile?.nama.toUpperCase()}
            </div>
            <div className="text-sm font-extrabold">{myProfile?.divisi.toUpperCase()}</div>
          </div>
          <div className="ml-auto text-right">
            <div className="text-md font-bold">{tanggalHariIni}</div>
          </div>
        </div>
        <div className="mt-4 flex justify-center">
          <button
            disabled={hasAbsent}
            onClick={() => setIsCamera(true)}
            className={`bg-black text-white py-2 px-6 rounded-full text-lg font-semibold ${
              hasAbsent ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Absensi Kehadiran
          </button>
        </div>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-4 gap-4 text-center text-black mb-5">
          {[
            { icon: <FaUsers />, text: "Daftar Karyawan" },
            { icon: <FaCalendarAlt />, text: "Izin Cuti" },
            { icon: <FaCalendar />, text: "Kalender" },
            { icon: <FaClock />, text: "Lembur" },
          ].map((item, index) => (
            <Link to={"/daftar-karyawan"} key={index}>
              <div className="flex justify-center text-2xl">{item.icon}</div>
              <div className="mt-2 text-sm font-medium">{item.text}</div>
            </Link>
          ))}
        </div>
        <Location onLocationUpdate={handleLocationUpdate} />
        {isCamera && <Camera onCapture={handleCapture}></Camera>}
        <div className="text-center text-xl text-green-700 font-bold mt-5 mb-5">
          <p>ABSENSI DILAKUKAN 2 HARI SEKALI</p>
          <p>08.00 | 17.00</p>
        </div>
        <div className="flex flex-col gap-3">
          {dataAbsensiSemuaKaryawan ? (
            dataAbsensiSemuaKaryawan.map((item: any, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between bg-green-500 text-white px-6 py-3 rounded-full shadow-xl gap-5"
              >
                <span className="font-semibold">
                  {index == 0 ? "Absen Masuk" : "Absen Pulang"}
                </span>
                <span className="text-sm font-semibold">{item.waktu}</span>
              </div>
            ))
          ) : (
            <LoadingRefresh></LoadingRefresh>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
