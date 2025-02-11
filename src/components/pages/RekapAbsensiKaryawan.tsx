import { useEffect, useState } from "react";
import { getDaftarKaryawan, getDataSemuaAbsensiKaryawan } from "../../firebase/service";
import { Link } from "react-router-dom";
import LoadingRefresh from "../ui/LoadingRefresh";

export default function RekapAbsensiKaryawan() {
  const [dataAbsensiSemuaKaryawan, setDataAbsensiSemuaKaryawan] = useState<any>(
    []
  );
  const date = new Date();
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const formattedDate = `${day}-${month}-${year}`;
  const [selectedBranch, setSelectedBranch] = useState("ALL");

  const branches = [
    "ALL",
    "BEKASI",
    "TANGERANG",
    "DEPOK",
    "JAKTIM",
    "JAKSEL",
    "CIKARANG",
    "BOGOR",
  ];

  useEffect(() => {
      getDataSemuaAbsensiKaryawan("absensi-karyawan-"+formattedDate).then((absensi: any) => {
        let hasilAbsensi:any=[];
        absensi.forEach((a: any) => {
          a.data.forEach((res:any)=>{
            hasilAbsensi.push(res)
          })
        })
        absensi = hasilAbsensi;
        getDaftarKaryawan().then((res: any) => {
          if (selectedBranch === "ALL") {
            let daftarKaryawanSementara = res;
            let arr: any = [];
            daftarKaryawanSementara.forEach((karyawan: any) => {
              if (arr.length === 0) return arr.push(karyawan);
              res = arr.filter(
                (filterKaryawan: any) => filterKaryawan.email === karyawan.email
              );
              if (res.length === 0) arr.push(karyawan);
            });
            const hasilMultiAbsensi = arr.map((k: any) => ({
              ...k,
              absensi: absensi.filter((a: any) => a.email === k.email),
            }));
            setDataAbsensiSemuaKaryawan(hasilMultiAbsensi);
          } else {
            let daftarKaryawanSementara = res;
            let arr: any = [];
            daftarKaryawanSementara.forEach((karyawan: any) => {
              if (arr.length === 0) return arr.push(karyawan);
              res = arr.filter(
                (filterKaryawan: any) => filterKaryawan.email === karyawan.email
              );
              if (res.length === 0) arr.push(karyawan);
            });
            const listKaryawan = arr.filter(
              (karyawan: any) =>
                karyawan.gerai.toLowerCase() === selectedBranch.toLowerCase()
            );
            const hasilMultiAbsensi = listKaryawan.map((k: any) => ({
              ...k,
              absensi: absensi.filter((a: any) => a.email === k.email),
            }));
            setDataAbsensiSemuaKaryawan(hasilMultiAbsensi);
          }
        });
      });
  }, [selectedBranch]);

  return (
    <div className="flex flex-col items-center w-3/4 desktop:w-1/2 mx-auto">
      <Link
        to="/daftar-karyawan"
        className="mt-4 flex w-full tablet:w-1/2 px-6 py-2 text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-800 justify-center items-center"
      >
        ⬅ Kembali ke Daftar Karyawan
      </Link>
      <h1 className="text-xl font-bold mb-3 text-center mt-5">
        Rekap Absensi Karyawan
      </h1>
      <div className="flex gap-2 items-center mb-4 justify-center">
        <p className="text-lg font-semibold">GERAI : </p>
        <select
          className="w-1/2 sm:w-40 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedBranch}
          onChange={(e) => {
            setSelectedBranch(e.target.value);
          }}
        >
          {branches.map((branch) => (
            <option key={branch} value={branch}>
              {branch}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col bg-white gap-5">
        {dataAbsensiSemuaKaryawan.length > 0 ? (
          dataAbsensiSemuaKaryawan.map((data: any, i: number) => (
            <div key={i} className="bg-orange-300 p-4 rounded-xl">
              <span className="flex justify-between">
                <p className="font-bold text-lg tablet:text-xl">
                  {data.nama.toUpperCase()}
                </p>
                <p className="font-semibold text-sm tablet:text-lg">
                  {data.gerai.toUpperCase()}
                </p>
              </span>
              <p className="">{data.divisi.toUpperCase()}</p>
              <p className="text-sm tablet:text-lg">{data.email}</p>
              <div className="flex flex-col gap-5">
                {data.absensi.length > 0 ? (
                  data.absensi.map((absensi: any, index: number) => (
                    <span key={index} className="flex gap-2">
                      <img
                        src={absensi.img}
                        className="w-[7em] h-[7em] tablet:w-[18em] tablet:h-[18em] object-cover object-center rounded-lg"
                        alt=""
                      />
                      <span>
                        <p className="font-semibold text-sm tablet:text-lg">
                          Alamat :{" "}
                        </p>
                        <p className="text-sm tablet:text-lg">
                          {absensi.alamat.substring(0, 50)}..
                        </p>
                        {index == 0 ? (
                          <p
                            className={`text-sm font-semibold tablet:text-lg ${
                              absensi.waktu < "08:05"
                                ? "bg-green-500"
                                : "bg-red-500"
                            } p-2 w-fit rounded-lg`}
                          >
                            {absensi.waktu}
                          </p>
                        ) : (
                          <p className="text-sm font-semibold tablet:text-lg bg-green-500 p-2 w-fit rounded-lg">
                            {absensi.waktu}
                          </p>
                        )}
                      </span>
                    </span>
                  ))
                ) : (
                  <p className="font-semibold text-2xl text-red-500">
                    Belum Absen
                  </p>
                )}
              </div>
            </div>
          ))
        ) : (
          <LoadingRefresh />
        )}
      </div>
    </div>
  );
}
