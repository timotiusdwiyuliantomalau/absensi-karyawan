import { useEffect, useState } from "react";
import { getDataKunjungan } from "../../firebase/service";
import LoadingRefresh from "../ui/LoadingRefresh";

export default function RekapKunjunganKaryawan() {
  const [dataKunjungan, setDataKunjungan] = useState<any>([]);
  const date = new Date();
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const formattedDate = `${day}-${month}-${year}`;

  useEffect(() => {
    getDataKunjungan("kunjungan-karyawan-" + formattedDate).then(
      (kunjungan: any) => {
        setDataKunjungan(kunjungan);
      }
    );
  }, []);

  return (
    <div className="flex flex-col items-center w-3/4 desktop:w-1/2 mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center mt-5">
        Rekap Kunjungan Karyawan
      </h1>
      <div className="flex flex-col bg-white gap-5">
        {dataKunjungan.length > 0 ? (
          dataKunjungan.map((data: any, i: number) => (
            <div key={i} className="bg-orange-400 p-4 rounded-xl">
              <span className="flex justify-between">
                <p className="font-bold text-lg tablet:text-xl">
                  {data.nama.toUpperCase()}
                </p>
              </span>
              <p className="">{data.divisi.toUpperCase()}</p>
              <p className="text-sm tablet:text-2xl font-semibold text-center">{data.deskripsi_kunjungan}</p>
              <p className="bg-blue-600 text-white font-bold flex place-self-center w-fit p-1 rounded-lg mb-3">{data.waktu}</p>
              <img src={data.img} alt="" />
            </div>
          ))
        ) : (
          <LoadingRefresh />
        )}
      </div>
    </div>
  );
}
