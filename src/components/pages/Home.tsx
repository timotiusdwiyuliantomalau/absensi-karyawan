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
import { Clock5, Clock8 } from "lucide-react";
import { useSelector } from "react-redux";
import { uploadImage } from "../ui/inputImageUploader";

const Home = () => {
  // const [selfieImage, setSelfieImage] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [isCamera, setIsCamera] = useState<boolean>(false);
  const [myProfile, setMyProfile] = useState<any>(null);
  const [dataAbsensiSemuaKaryawan, setDataAbsensiSemuaKaryawan] =
    useState<any>(undefined);
  const [hasAbsent, setHasAbsent] = useState<boolean>(true);
  const jamMasuk = "08:05";
  const jamPulang = "17:00";
  const date = new Date();
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const formattedDate = `${day}-${month}-${year}`;
  let currentTime = new Date()
    .toLocaleTimeString("en-GB", { hour12: false })
    .substring(0, 5);
  const imgURL = useSelector((state: any) => state.slice.imgURL);

  useEffect(() => {
    const result = getCookie("myData");
    setMyProfile(JSON.parse(result || ""));
    getDataAbsensi(formattedDate).then((res: any) => {
      setHasAbsent(false);
      if (!res) return setDataAbsensiSemuaKaryawan([]);
      const dataAbsensi = res.data.filter(
        (data: any) => result && data.email == JSON.parse(result).email
      );
      setDataAbsensiSemuaKaryawan(dataAbsensi);
      if (dataAbsensi.length < 2) {
        setHasAbsent(false);
        if (dataAbsensi.length == 1 && currentTime <= jamPulang)
          return setHasAbsent(true);
        if (currentTime >= jamPulang) setHasAbsent(false);
      } else {
        setHasAbsent(true);
      }
    });
    if (imgURL.length > 0) {
      setIsSubmit(true);
      setIsCamera(false);
      setHasAbsent(true);
      setDataAbsensiSemuaKaryawan([]);
      uploadImage(imgURL).then((res: any) => {
        if (location.length == 0)
          return alert(
            "ALAMAT BELUM TERDETEKSI! NYALAKAN GPS ANDA TERLEBIH DAHULU!"
          );
        handleSubmitAbsensi(
          { ...myProfile, alamat: location, waktu: currentTime, img: res },
          formattedDate
        ).then((res: any) => {
          setDataAbsensiSemuaKaryawan(res);
          Swal.fire("Berhasil", "Anda telah absen!", "success");
          window.location.reload();
        });
      });
    }
  }, [imgURL]);

  const handleLocationUpdate = (address: string) => {
    setLocation(address);
  };

  return (
    <div className="bg-gray-200 font-roboto min-h-screen">
      {isSubmit && <LoadingElement></LoadingElement>}
      <div className="bg-orange-500 text-white px-4 pt-4 pb-7 rounded-b-3xl flex flex-col">
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
        <div className="flex items-center mt-4 text-white justify-between">
          <div className="flex gap-2">
            <span className="bg-white rounded-full h-fit">
              <MdAccountCircle className="text-7xl text-blue-500 rounded-full"></MdAccountCircle>
            </span>
            <div>
              <div className="text-lg font-extrabold">
                {myProfile?.nama.toUpperCase()}
              </div>
              <div className="text-lg ">{myProfile?.divisi.toUpperCase()}</div>
            </div>
          </div>

          <div className="text-md font-bold flex gap-2 items-center">
            <FaCalendar className="text-2xl" />
            <p className="text-[10] ">{tanggalHariIni}</p>
          </div>
        </div>
        <div className="mt-4 flex justify-center">
          <button
            disabled={hasAbsent}
            onClick={() => setIsCamera(true)}
            className={`bg-black text-white py-2 px-6 rounded-full text-lg font-semibold ${
              hasAbsent ? "opacity-40 cursor-not-allowed" : ""
            }`}
          >
            Absensi Kehadiran
          </button>
        </div>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-4 gap-3 tablet:gap-5 text-center text-black mb-5">
          {[
            { icon: <FaUsers />, text: "Daftar Karyawan" },
            { icon: <FaCalendarAlt />, text: "Izin Cuti" },
            { icon: <FaCalendar />, text: "Kalender" },
            { icon: <FaClock />, text: "Lembur" },
          ].map((item, index) => (
            <Link
              to={"/"}
              key={index}
              className="bg-white p-4 rounded-lg flex flex-col "
            >
              <div className="flex justify-center text-2xl">{item.icon}</div>
              <div className="mt-2 text-sm font-medium h-5 flex items-center justify-center">
                {item.text}
              </div>
            </Link>
          ))}
        </div>
        <Location onLocationUpdate={handleLocationUpdate} />
        {isCamera && <Camera></Camera>}
        <div className="text-center text-xl text-green-700 font-bold mt-12 mb-4 flex flex-col items-center justify-center gap-2">
          <p className="text-black">ABSENSI DILAKUKAN 2 KALI SEHARI</p>
          <span className="text-sm flex gap-3">
            <span className="flex gap-1 bg-yellow-400 p-2 rounded-full">
              {" "}
              <Clock8></Clock8> <p>08.00</p>
            </span>
            <span className="flex gap-1 bg-yellow-400 p-2 rounded-full">
              <Clock5></Clock5> <p>17.00</p>
            </span>
          </span>
        </div>
        <div className="flex flex-col gap-3 rounded-xl">
          {dataAbsensiSemuaKaryawan ? (
            dataAbsensiSemuaKaryawan.map((item: any, index: number) => (
              <div key={index}>
                {index == 0 ? (
                  <div
                    className={`flex items-center justify-between text-white px-10 py-3 rounded-full shadow-xl gap-5 desktop:font-bold ${
                      item.waktu < jamMasuk ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    <span className="font-bold py-2">
                      {index == 0 ? "Absen Masuk" : "Absen Pulang"}
                    </span>
                    <span className="text-xs tablet:text-sm font-semibold">
                      {item.waktu > jamMasuk && <p>Terlambat</p>}
                      <span className="font-semibold">{item.waktu}</span>
                    </span>
                  </div>
                ) : (
                  <div
                    key={index}
                    className={`flex items-center justify-between text-white px-10 py-3 rounded-full shadow-xl gap-5 desktop:font-bold bg-green-500`}
                  >
                    <span className="font-bold py-2">
                      {index == 0 ? "Absen Masuk" : "Absen Pulang"}
                    </span>
                    <span className="text-xs tablet:text-sm font-semibold">
                      {item.waktu > jamPulang && <p>Terlambat</p>}
                      <span className="font-semibold">{item.waktu}</span>
                    </span>
                  </div>
                )}
              </div>
            ))
          ) : (
            <LoadingRefresh></LoadingRefresh>
          )}
          {dataAbsensiSemuaKaryawan && dataAbsensiSemuaKaryawan.length < 1 && (
            <div className="text-red-500 text-center -mt-3 font-semibold">
              Anda belum absen hari ini!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
