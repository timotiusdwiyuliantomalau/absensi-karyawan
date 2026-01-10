import { useEffect, useState } from "react";
import {
  getDaftarKaryawan,
  getDataSemuaAbsensiKaryawan,
  getGerai,
} from "../../firebase/service";
import LoadingRefresh from "../ui/LoadingRefresh";
import { DownloadIcon } from "lucide-react";
import * as XLSX from "xlsx";

export default function RekapAbsensiKaryawan() {
  const [dataAbsensiSemuaKaryawan, setDataAbsensiSemuaKaryawan] = useState<any>(
    []
  );
  const date = new Date();
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const [formattedDate, setFormattedDate] = useState(`${day}-${month}-${year}`);
  const [selectedBranch, setSelectedBranch] = useState("ALL");
  const [branches, setBranches] = useState(["ALL"]);

  useEffect(() => {
    getGerai().then((branch: any) => {
      const listBranch = branch.map((branch: any) => branch.nama.toUpperCase());
      setBranches(["ALL", ...listBranch]);
    });
    getDataSemuaAbsensiKaryawan("absensi-karyawan-" + formattedDate).then(
      (absensi: any) => {
        let hasilAbsensi: any = [];
        absensi.forEach((a: any) => {
          a.data.forEach((res: any) => {
            hasilAbsensi.push(res);
          });
        });
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
              absensi: absensi.filter(
                (a: any) => a.email === k.email.toLowerCase()
              ),
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
              absensi: absensi.filter(
                (a: any) => a.email.toLowerCase() === k.email.toLowerCase()
              ),
            }));
            setDataAbsensiSemuaKaryawan(hasilMultiAbsensi);
          }
        });
      }
    );
  }, [selectedBranch, formattedDate]);

  const handleExportExcel = () => {
    const data = dataAbsensiSemuaKaryawan;
    const workbook = XLSX.utils.book_new();

    // Process data
    const karyawanMasuk: any[] = [];
    const karyawanPulang: any[] = [];
    const karyawanLembur: any[] = [];
    const karyawanTidakMasuk: any[] = [];

    data.forEach((karyawan: any) => {
      if (karyawan.absensi.length === 0) {
        // Karyawan tidak masuk
        karyawanTidakMasuk.push({
          gerai: karyawan.gerai.toUpperCase(),
          nama: karyawan.nama.toUpperCase(),
          posisi: karyawan.divisi.toUpperCase(),
        });
      } else {
        // Karyawan masuk (first entry)
        const firstAbsen = karyawan.absensi[0];
        karyawanMasuk.push({
          gerai: karyawan.gerai.toUpperCase(),
          nama: karyawan.nama.toUpperCase(),
          posisi: karyawan.divisi.toUpperCase(),
          alamat: firstAbsen.alamat.toUpperCase(),
          waktu: firstAbsen.waktu,
        });

        // Check for pulang and lembur
        karyawan.absensi.forEach((absen: any) => {
          const [hours, minutes] = absen.waktu.split(":").map(Number);
          const waktuMinutes = hours * 60 + minutes;[]
          const batasWaktu = 17 * 60; // 17:00
          // Karyawan lembur
          if (absen.overtime === "yes") {
            karyawanLembur.push({
              gerai: karyawan.gerai.toUpperCase(),
              nama: karyawan.nama.toUpperCase(),
              posisi: karyawan.divisi.toUpperCase(),
              alamat: absen.alamat.toUpperCase(),
              waktu: absen.waktu,
            });
          }

          // Karyawan pulang
          if (waktuMinutes >= batasWaktu&&!absen.overtime||waktuMinutes >= batasWaktu && absen.overtime === "no") {
            karyawanPulang.push({
              gerai: karyawan.gerai.toUpperCase(),
              nama: karyawan.nama.toUpperCase(),
              posisi: karyawan.divisi.toUpperCase(),
              alamat: absen.alamat.toUpperCase(),
              waktu: absen.waktu,
            });
          }
        });
      }
    });

    // Create worksheet data
    const worksheetData: any[] = [];

    // Title
    worksheetData.push([`REKAP ABSENSI ${formattedDate.toUpperCase()}`]);
    worksheetData.push([]);

    // Tabel Karyawan Masuk
    worksheetData.push(["ABSEN KARYAWAN MASUK"]);
    worksheetData.push(["NO.", "GERAI", "NAMA", "POSISI", "ALAMAT", "WAKTU"]);
    karyawanMasuk.forEach((k, idx) => {
      worksheetData.push([
        idx + 1,
        k.gerai,
        k.nama,
        k.posisi,
        k.alamat,
        k.waktu,
      ]);
    });
    worksheetData.push([]);

    // Tabel Karyawan Pulang
    const pulangStartRow = worksheetData.length;
    worksheetData.push(["ABSEN KARYAWAN PULANG"]);
    worksheetData.push(["NO.", "GERAI", "NAMA", "POSISI", "ALAMAT", "WAKTU"]);
    karyawanPulang.forEach((k, idx) => {
      worksheetData.push([
        idx + 1,
        k.gerai,
        k.nama,
        k.posisi,
        k.alamat,
        k.waktu,
      ]);
    });
    worksheetData.push([]);

    // Tabel Karyawan Lembur
    const lemburStartRow = worksheetData.length;
    worksheetData.push(["ABSEN KARYAWAN LEMBUR"]);
    worksheetData.push(["NO.", "GERAI", "NAMA", "POSISI", "ALAMAT", "WAKTU"]);
    karyawanLembur.forEach((k, idx) => {
      worksheetData.push([
        idx + 1,
        k.gerai,
        k.nama,
        k.posisi,
        k.alamat,
        k.waktu,
      ]);
    });
    worksheetData.push([]);

    // Tabel Karyawan Tidak Masuk
    const tidakMasukStartRow = worksheetData.length;
    worksheetData.push(["ABSEN KARYAWAN TIDAK MASUK"]);
    worksheetData.push(["NO.", "GERAI", "NAMA", "POSISI"]);
    karyawanTidakMasuk.forEach((k, idx) => {
      worksheetData.push([idx + 1, k.gerai, k.nama, k.posisi]);
    });

    // Create worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Set column widths
    worksheet["!cols"] = [
      { wch: 5 }, // NO
      { wch: 15 }, // GERAI
      { wch: 30 }, // NAMA
      { wch: 25 }, // POSISI
      { wch: 60 }, // ALAMAT
      { wch: 10 }, // WAKTU
    ];

    // Apply styles
    const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1");

    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
        if (!worksheet[cellAddress]) continue;

        // Initialize cell style
        if (!worksheet[cellAddress].s) worksheet[cellAddress].s = {};

        // Add center alignment to all cells
        worksheet[cellAddress].s.alignment = {
          horizontal: "center",
          vertical: "center",
        };

        // Add borders to all cells with data
        worksheet[cellAddress].s.border = {
          top: { style: "thin", color: { rgb: "000000" } },
          bottom: { style: "thin", color: { rgb: "000000" } },
          left: { style: "thin", color: { rgb: "000000" } },
          right: { style: "thin", color: { rgb: "000000" } },
        };

        // Title styling
        if (R === 0) {
          worksheet[cellAddress].s.font = { bold: true, sz: 16 };
          worksheet[cellAddress].s.alignment = {
            horizontal: "center",
            vertical: "center",
          };
        }

        // Karyawan Masuk header (green)
        if (R === 3) {
          worksheet[cellAddress].s.fill = { fgColor: { rgb: "00B050" } };
          worksheet[cellAddress].s.font = {
            bold: true,
            color: { rgb: "FFFFFF" },
          };
          worksheet[cellAddress].s.alignment = {
            horizontal: "center",
            vertical: "center",
          };
        }

        // Karyawan Pulang header (green)
        if (R === pulangStartRow + 1) {
          worksheet[cellAddress].s.fill = { fgColor: { rgb: "00B050" } };
          worksheet[cellAddress].s.font = {
            bold: true,
            color: { rgb: "FFFFFF" },
          };
          worksheet[cellAddress].s.alignment = {
            horizontal: "center",
            vertical: "center",
          };
        }

        // Karyawan Lembur header (yellow)
        if (R === lemburStartRow + 1) {
          worksheet[cellAddress].s.fill = { fgColor: { rgb: "FFFF00" } };
          worksheet[cellAddress].s.font = { bold: true };
          worksheet[cellAddress].s.alignment = {
            horizontal: "center",
            vertical: "center",
          };
        }

        // Karyawan Tidak Masuk header (red)
        if (R === tidakMasukStartRow + 1) {
          worksheet[cellAddress].s.fill = { fgColor: { rgb: "FF0000" } };
          worksheet[cellAddress].s.font = {
            bold: true,
            color: { rgb: "FFFFFF" },
          };
          worksheet[cellAddress].s.alignment = {
            horizontal: "center",
            vertical: "center",
          };
        }
      }
    }

    // Merge title cell
    worksheet["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 5 } }];

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Rekap Absensi");

    // Generate filename
    const filename = `Rekap_Absensi_${formattedDate}.xlsx`;

    // Download file
    XLSX.writeFile(workbook, filename);
  };
  return (
    <div className="flex flex-col items-center w-3/4 desktop:w-1/2 mx-auto mt-5">
      <input
        value={formattedDate.split("-").reverse().join("-")}
        onChange={(e) => {
          setDataAbsensiSemuaKaryawan([]);
          setFormattedDate(e.target.value.split("-").reverse().join("-"));
        }}
        type="date"
        name=""
        id=""
        className="border-2 border-gray-300 p-2 rounded-xl text-black"
      />
      <button
        className="flex gap-1 items-center mt-4 px-6 py-2 text-white bg-green-600 rounded-lg shadow-md hover:bg-green-800 justify-center"
        onClick={handleExportExcel}
      >
        Download Excel <DownloadIcon />
      </button>
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
                              absensi.waktu < "08:06"
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
