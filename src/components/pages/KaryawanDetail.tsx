import { useEffect, useState } from "react";
import { getDataAbsensi, getPersonalKaryawan } from "../../firebase/service";
import { Link, useParams } from "react-router-dom";

export default function KaryawanDetail() {
  const [karyawan, setKaryawan] = useState<any>(undefined);
  const { email } = useParams();
  const date = new Date();
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const formattedDate = `${day}-${month}-${year}`;
  const [absensiKaryawan, setAbsensiKaryawan] = useState<any>([]);
  const jamMasuk="08.00";

  useEffect(() => {
    email &&
      getPersonalKaryawan(email).then((data) => {
        setKaryawan(data);
        if (data !== "TIDAK ADA DATA") {
          const response = data;
          email &&
            getDataAbsensi(formattedDate).then((res) => {
              if (res) {
                const dataAbsensi = res.data.filter(
                  (result: any) => response?.email == result.email
                );
                setAbsensiKaryawan(dataAbsensi);
              }
            });
        } else {
          // handle the case where data is "TIDAK ADA DATA"
          console.log("No data found");
        }
      });
  }, []);
  return (
    <>
      {karyawan && (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <div className="bg-white shadow-xl rounded-lg p-8 max-w-sm w-full text-center">
            <h2 className="text-3xl font-bold mt-4">
              {karyawan.nama.toUpperCase()}
            </h2>
            <p className="text-gray-600 text-xl font-semibold mb-5">
              {karyawan.divisi.toUpperCase()}
            </p>
            <p className="font-bold text-xl mb-2">ABSENSI KARYAWAN</p>
            <div className="flex flex-col gap-5">
              {absensiKaryawan.length > 0 &&
                absensiKaryawan.map((item: any, index: number) => (
                  <div key={index} className="bg-gray-100 p-3 rounded-xl">
                    <img src={item.img} alt="" />
                    <p>Alamat : {item.alamat}</p>
                    {index==0?<p className={item.waktu<jamMasuk?"bg-green-300 font-semibold":"bg-red-500 rounded-lg font-semibold"}>{item.waktu}</p>:<p className="bg-green-500 rounded-lg font-semibold">{item.waktu}</p>}
                  </div>
                ))}
            </div>
            <Link
              to="/absensi-karyawan"
              className="mt-6 inline-block px-6 py-2 text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition"
            >
              ⬅ Kembali ke Daftar Karyawan
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
