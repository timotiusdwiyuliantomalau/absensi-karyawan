import { useEffect, useState } from "react";
import { getDataKunjungan } from "../../firebase/service";
import LoadingRefresh from "../ui/LoadingRefresh";
import { CalendarDays } from "lucide-react";

export default function RekapKunjunganKaryawan() {
  const [dataKunjungan, setDataKunjungan] = useState<any>(undefined);
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
      <h1 className="text-2xl font-bold text-center mt-7">
        Rekap Kunjungan Karyawan
      </h1>
      <p className="text-lg font-bold text-blue-600 flex gap-1 mb-2 mt-1"><CalendarDays></CalendarDays> {formattedDate}</p>
      <div className="flex flex-col bg-white gap-5">
        {dataKunjungan ? (
          dataKunjungan.map((data: any, i: number) => (
            <div key={i} className="bg-orange-400 p-4 rounded-xl flex flex-col">
              <span className="flex justify-between">
                <p className="font-bold text-lg tablet:text-xl">
                  {data.nama.toUpperCase()}
                </p>
              </span>
              <p>{data.divisi.toUpperCase()}</p>
              <p className="mb-1">{data.alamat}</p>
              <p className="text-xl tablet:text-2xl font-bold text-center">
                {data.deskripsi_kunjungan}
              </p>
              <p className="bg-blue-600 text-sm tablet:text-lg text-white font-semibold flex place-self-center w-fit p-1 rounded-lg mb-3">
                {data.waktu}
              </p>
              <img src={data.img} alt="" />
            </div>
          ))
        ) : (
          <LoadingRefresh />
        )}
        {dataKunjungan&&dataKunjungan.length < 1 && (
          <p className="text-red-500 text-xl font-semibold">
            tidak ada kunjungan hari ini..
          </p>
        )}
      </div>
    </div>
  );
}
