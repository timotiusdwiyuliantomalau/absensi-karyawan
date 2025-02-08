import { useEffect, useState } from "react";
import { getDaftarKaryawan, getDataAbsensi } from "../../firebase/service";
import { Link } from "react-router-dom";

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
    getDataAbsensi(formattedDate).then((absensi: any) => {
      getDaftarKaryawan().then((res: any) => {
        if(selectedBranch === "ALL") {
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
          absensi: absensi.data.filter((a: any) => a.email === k.email),
        }));
        setDataAbsensiSemuaKaryawan(hasilMultiAbsensi);
      }else{
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
          absensi: absensi.data.filter((a: any) => a.email === k.email),
        }));
        setDataAbsensiSemuaKaryawan(hasilMultiAbsensi);
      }
    
    });
    });
  }, [selectedBranch]);

  return (
    <div className="w-3/4 mx-auto">
        <Link
              to="/absensi-karyawan"
              className="mt-6 inline-block px-6 py-2 text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition"
            >
              ⬅ Kembali ke Daftar Karyawan
            </Link>
      <h1 className="text-3xl font-bold mb-3 text-center mt-5">Rekap Absensi Karyawan</h1>
      <div className="flex gap-2 items-center mb-4 justify-center">
        <p className="text-xl font-semibold">GERAI : </p>
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
        {dataAbsensiSemuaKaryawan.length > 0 &&
          dataAbsensiSemuaKaryawan.map((data: any, i: number) => (
            <div key={i} className="bg-orange-300 p-4 rounded-xl">
              <span className="flex justify-between">
                <p className="font-bold text-xl">{data.nama.toUpperCase()}</p>
                <p className="font-semibold text-lg">
                  {data.gerai.toUpperCase()}
                </p>
              </span>
              <p className="">{data.divisi.toUpperCase()}</p>
              <p>{data.email}</p>
              {data.absensi.length > 0 ? (
                data.absensi.map((absensi: any) => (
                  <span className="flex gap-4">
                    <img
                      src={absensi.img}
                      className="w-[14em] h-[14em] tablet:w-[18em] tablet:h-[18em] object-cover object-center rounded-lg"
                      alt=""
                    />
                    <span>
                      <p className="font-semibold">Alamat : </p>
                      <p className="text-xs tablet:text-lg">{absensi.alamat}</p>
                    </span>
                  </span>
                ))
              ) : (
                <p className="font-semibold text-2xl text-red-500">
                  Belum Absen
                </p>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
