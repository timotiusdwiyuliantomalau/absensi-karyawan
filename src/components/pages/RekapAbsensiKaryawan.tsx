import { useEffect, useState } from "react";
import {
  getDaftarKaryawan,
  getDataSemuaAbsensiKaryawan,
  getGerai,
} from "../../firebase/service";
import LoadingRefresh from "../ui/LoadingRefresh";
import { DownloadIcon } from "lucide-react";
import * as XLSX from "xlsx-js-style";

export default function RekapAbsensiKaryawan() {
  const [dataAbsensiSemuaKaryawan, setDataAbsensiSemuaKaryawan] = useState<any>(
    [],
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
                (filterKaryawan: any) =>
                  filterKaryawan.email === karyawan.email,
              );
              if (res.length === 0) arr.push(karyawan);
            });
            const hasilMultiAbsensi = arr.map((k: any) => ({
              ...k,
              absensi: absensi.filter(
                (a: any) => a.email === k.email.toLowerCase(),
              ),
            }));
            setDataAbsensiSemuaKaryawan(hasilMultiAbsensi);
          } else {
            let daftarKaryawanSementara = res;
            let arr: any = [];
            daftarKaryawanSementara.forEach((karyawan: any) => {
              if (arr.length === 0) return arr.push(karyawan);
              res = arr.filter(
                (filterKaryawan: any) =>
                  filterKaryawan.email === karyawan.email,
              );
              if (res.length === 0) arr.push(karyawan);
            });
            const listKaryawan = arr.filter(
              (karyawan: any) =>
                karyawan.gerai.toLowerCase() === selectedBranch.toLowerCase(),
            );
            const hasilMultiAbsensi = listKaryawan.map((k: any) => ({
              ...k,
              absensi: absensi.filter(
                (a: any) => a.email.toLowerCase() === k.email.toLowerCase(),
              ),
            }));
            setDataAbsensiSemuaKaryawan(hasilMultiAbsensi);
          }
        });
      },
    );
  }, [selectedBranch, formattedDate]);

 const handleExportExcel = () => {
    console.log({dataAbsensiSemuaKaryawan});
    const data = dataAbsensiSemuaKaryawan;
    const workbook = XLSX.utils.book_new();
    
    // Process data
    const karyawanMasuk: any[] = [];
    const karyawanPulang: any[] = [];
    const karyawanLembur: any[] = [];
    const karyawanTidakMasuk: any[] = [];
    const karyawanIzin: any[] = [];

    data.forEach((karyawan: any) => {
      if (karyawan.absensi.length === 0) {
        karyawanTidakMasuk.push({
          gerai: karyawan.gerai.toUpperCase(),
          nama: karyawan.nama.toUpperCase(),
          posisi: karyawan.divisi.toUpperCase(),
        });
      } else {
        const firstAbsen = karyawan.absensi[0];
        karyawanMasuk.push({
          gerai: karyawan.gerai.toUpperCase(),
          nama: karyawan.nama.toUpperCase(),
          posisi: karyawan.divisi.toUpperCase(),
          alamat: firstAbsen.alamat.toUpperCase(),
          waktu: firstAbsen.waktu,
        });

        karyawan.absensi.forEach((absen: any) => {
          const [hours, minutes] = absen.waktu.split(":").map(Number);
          const waktuMinutes = hours * 60 + minutes;
          const batasWaktu = 17 * 60;

          // Check untuk karyawan izin
          if (absen.alasan_izin_kerja) {
            karyawanIzin.push({
              gerai: karyawan.gerai.toUpperCase(),
              nama: karyawan.nama.toUpperCase(),
              alasan: absen.alasan_izin_kerja.toUpperCase(),
              alamat: absen.alamat.toUpperCase(),
              waktu: absen.waktu,
            });
          }

          if (absen.overtime === "yes") {
            karyawanLembur.push({
              gerai: karyawan.gerai.toUpperCase(),
              nama: karyawan.nama.toUpperCase(),
              posisi: karyawan.divisi.toUpperCase(),
              alamat: absen.alamat.toUpperCase(),
              waktu: absen.waktu,
            });
          }

          if (
            waktuMinutes >= batasWaktu &&
            (!absen.overtime || absen.overtime === "no")
          ) {
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

    // Function to group by gerai
    const groupByGerai = (items: any[]) => {
      const grouped: { [key: string]: any[] } = {};
      items.forEach((item) => {
        if (!grouped[item.gerai]) {
          grouped[item.gerai] = [];
        }
        grouped[item.gerai].push(item);
      });
      return grouped;
    };

    const masukByGerai = groupByGerai(karyawanMasuk);
    const pulangByGerai = groupByGerai(karyawanPulang);
    const lemburByGerai = groupByGerai(karyawanLembur);
    const tidakMasukByGerai = groupByGerai(karyawanTidakMasuk);
    const izinByGerai = groupByGerai(karyawanIzin);

    // Create worksheet data
    const worksheetData: any[] = [];

    // Title
    worksheetData.push([`REKAP ABSENSI ${formattedDate.toUpperCase()}`]);
    worksheetData.push([]);

    // Tabel Karyawan Masuk
    const masukTitleRow = worksheetData.length;
    worksheetData.push(["ABSEN KARYAWAN MASUK"]);
    const masukHeaderRow = worksheetData.length;
    worksheetData.push(["NO.", "GERAI", "NAMA", "POSISI", "ALAMAT", "WAKTU"]);

    let counterMasuk = 1;
    const masukDataStartRow = worksheetData.length;
    Object.keys(masukByGerai)
      .sort()
      .forEach((gerai) => {
        masukByGerai[gerai].forEach((k, idx) => {
          worksheetData.push([
            counterMasuk++,
            idx === 0 ? k.gerai : "",
            k.nama,
            k.posisi,
            k.alamat,
            k.waktu,
          ]);
        });
      });
    worksheetData.push([]);

    // Tabel Karyawan Pulang
    const pulangTitleRow = worksheetData.length;
    worksheetData.push(["ABSEN KARYAWAN PULANG"]);
    const pulangHeaderRow = worksheetData.length;
    worksheetData.push(["NO.", "GERAI", "NAMA", "POSISI", "ALAMAT", "WAKTU"]);

    let counterPulang = 1;
    const pulangDataStartRow = worksheetData.length;
    Object.keys(pulangByGerai)
      .sort()
      .forEach((gerai) => {
        pulangByGerai[gerai].forEach((k, idx) => {
          worksheetData.push([
            counterPulang++,
            idx === 0 ? k.gerai : "",
            k.nama,
            k.posisi,
            k.alamat,
            k.waktu,
          ]);
        });
      });
    worksheetData.push([]);

    // Tabel Karyawan Lembur
    const lemburTitleRow = worksheetData.length;
    worksheetData.push(["ABSEN KARYAWAN LEMBUR"]);
    const lemburHeaderRow = worksheetData.length;
    worksheetData.push(["NO.", "GERAI", "NAMA", "POSISI", "ALAMAT", "WAKTU"]);

    let counterLembur = 1;
    const lemburDataStartRow = worksheetData.length;
    Object.keys(lemburByGerai)
      .sort()
      .forEach((gerai) => {
        lemburByGerai[gerai].forEach((k, idx) => {
          worksheetData.push([
            counterLembur++,
            idx === 0 ? k.gerai : "",
            k.nama,
            k.posisi,
            k.alamat,
            k.waktu,
          ]);
        });
      });
    worksheetData.push([]);

    // Tabel Karyawan Izin (BARU)
    let izinTitleRow, izinHeaderRow, izinDataStartRow;
    if (karyawanIzin.length > 0) {
      izinTitleRow = worksheetData.length;
      worksheetData.push(["ABSEN KARYAWAN IZIN"]);
      izinHeaderRow = worksheetData.length;
      worksheetData.push(["NO.", "GERAI", "NAMA", "ALASAN", "ALAMAT", "WAKTU"]);

      let counterIzin = 1;
      izinDataStartRow = worksheetData.length;
      Object.keys(izinByGerai)
        .sort()
        .forEach((gerai) => {
          izinByGerai[gerai].forEach((k, idx) => {
            worksheetData.push([
              counterIzin++,
              idx === 0 ? k.gerai : "",
              k.nama,
              k.alasan,
              k.alamat,
              k.waktu,
            ]);
          });
        });
      worksheetData.push([]);
    }

    // Tabel Karyawan Tidak Masuk
    const tidakMasukTitleRow = worksheetData.length;
    worksheetData.push(["ABSEN KARYAWAN TIDAK MASUK"]);
    const tidakMasukHeaderRow = worksheetData.length;
    worksheetData.push(["NO.", "GERAI", "NAMA", "POSISI"]);

    let counterTidakMasuk = 1;
    const tidakMasukDataStartRow = worksheetData.length;
    Object.keys(tidakMasukByGerai)
      .sort()
      .forEach((gerai) => {
        tidakMasukByGerai[gerai].forEach((k, idx) => {
          worksheetData.push([
            counterTidakMasuk++,
            idx === 0 ? k.gerai : "",
            k.nama,
            k.posisi,
          ]);
        });
      });

    // Create worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Set column widths
    worksheet["!cols"] = [
      { wch: 5 }, // NO
      { wch: 15 }, // GERAI
      { wch: 30 }, // NAMA
      { wch: 25 }, // POSISI/ALASAN
      { wch: 60 }, // ALAMAT
      { wch: 10 }, // WAKTU
    ];

    // Initialize merges
    if (!worksheet["!merges"]) worksheet["!merges"] = [];

    // Helper functions
    const getCellRef = (row: number, col: number) =>
      XLSX.utils.encode_cell({ r: row, c: col });

    const applyCellStyle = (cellRef: string, style: any) => {
      if (!worksheet[cellRef]) worksheet[cellRef] = { v: "", t: "s" };
      worksheet[cellRef].s = style;
    };

    const getMerges = () => {
      if (!worksheet["!merges"]) worksheet["!merges"] = [];
      return worksheet["!merges"];
    };

    // Helper function to check if time is late (> 08:05)
    const isLate = (waktu: string): boolean => {
      const [hours, minutes] = waktu.split(":").map(Number);
      const waktuMinutes = hours * 60 + minutes;
      const batasWaktuMasuk = 8 * 60 + 5; // 08:05
      return waktuMinutes > batasWaktuMasuk;
    };

    // Define colors
    const COLORS = {
      PRIMARY_GREEN: "00B050",
      LIGHT_GREEN: "92D050",
      YELLOW: "FFC000",
      LIGHT_YELLOW: "FFFF99",
      RED: "FF0000",
      LIGHT_RED: "FF9999",
      BLUE: "4472C4",
      LIGHT_BLUE: "B4C7E7",
      WHITE: "FFFFFF",
      BLACK: "000000",
      HEADER_GRAY: "595959",
    };

    // Define styles
    const titleStyle = {
      font: { name: "Calibri", sz: 16, bold: true },
      fill: { fgColor: { rgb: COLORS.WHITE } },
      alignment: { horizontal: "center", vertical: "center" },
      border: {
        top: { style: "medium", color: { rgb: COLORS.BLACK } },
        bottom: { style: "medium", color: { rgb: COLORS.BLACK } },
        left: { style: "medium", color: { rgb: COLORS.BLACK } },
        right: { style: "medium", color: { rgb: COLORS.BLACK } },
      },
    };

    const sectionTitleStyle = (bgColor: string) => ({
      font: { name: "Calibri", sz: 12, bold: true },
      fill: { fgColor: { rgb: bgColor } },
      alignment: { horizontal: "center", vertical: "center" },
      border: {
        top: { style: "medium", color: { rgb: COLORS.BLACK } },
        bottom: { style: "medium", color: { rgb: COLORS.BLACK } },
        left: { style: "medium", color: { rgb: COLORS.BLACK } },
        right: { style: "medium", color: { rgb: COLORS.BLACK } },
      },
    });

    const tableHeaderStyle = (bgColor: string, fontColor: string) => ({
      font: { name: "Calibri", sz: 11, bold: true, color: { rgb: fontColor } },
      fill: { fgColor: { rgb: bgColor } },
      alignment: { horizontal: "center", vertical: "center" },
      border: {
        top: { style: "medium", color: { rgb: COLORS.BLACK } },
        bottom: { style: "medium", color: { rgb: COLORS.BLACK } },
        left: { style: "thin", color: { rgb: COLORS.BLACK } },
        right: { style: "thin", color: { rgb: COLORS.BLACK } },
      },
    });

    const dataRowStyle = {
      font: { name: "Calibri", sz: 10 },
      alignment: { horizontal: "center", vertical: "center" },
      border: {
        top: { style: "thin", color: { rgb: COLORS.HEADER_GRAY } },
        bottom: { style: "thin", color: { rgb: COLORS.HEADER_GRAY } },
        left: { style: "thin", color: { rgb: COLORS.HEADER_GRAY } },
        right: { style: "thin", color: { rgb: COLORS.HEADER_GRAY } },
      },
    };

    const lateRowStyle = {
      font: {
        name: "Calibri",
        sz: 10,
        bold: true,
        color: { rgb: COLORS.WHITE },
      },
      fill: { fgColor: { rgb: COLORS.RED } },
      alignment: { horizontal: "center", vertical: "center" },
      border: {
        top: { style: "thin", color: { rgb: COLORS.HEADER_GRAY } },
        bottom: { style: "thin", color: { rgb: COLORS.HEADER_GRAY } },
        left: { style: "thin", color: { rgb: COLORS.HEADER_GRAY } },
        right: { style: "thin", color: { rgb: COLORS.HEADER_GRAY } },
      },
    };

    const onTimeRowStyle = {
      font: {
        name: "Calibri",
        sz: 10,
        bold: true,
        color: { rgb: COLORS.WHITE },
      },
      fill: { fgColor: { rgb: COLORS.PRIMARY_GREEN } },
      alignment: { horizontal: "center", vertical: "center" },
      border: {
        top: { style: "thin", color: { rgb: COLORS.HEADER_GRAY } },
        bottom: { style: "thin", color: { rgb: COLORS.HEADER_GRAY } },
        left: { style: "thin", color: { rgb: COLORS.HEADER_GRAY } },
        right: { style: "thin", color: { rgb: COLORS.HEADER_GRAY } },
      },
    };

    // Apply styles - Title
    for (let col = 0; col < 6; col++) {
      applyCellStyle(getCellRef(0, col), titleStyle);
    }

    // Apply styles - Karyawan Masuk
    for (let col = 0; col < 6; col++) {
      applyCellStyle(
        getCellRef(masukTitleRow, col),
        sectionTitleStyle(COLORS.LIGHT_GREEN),
      );
      applyCellStyle(
        getCellRef(masukHeaderRow, col),
        tableHeaderStyle(COLORS.PRIMARY_GREEN, COLORS.WHITE),
      );
    }

    let masukRowIndex = 0;
    Object.keys(masukByGerai)
      .sort()
      .forEach((gerai) => {
        masukByGerai[gerai].forEach((k) => {
          const currentRow = masukDataStartRow + masukRowIndex;
          const waktuKaryawan = k.waktu;
          const styleToApply = isLate(waktuKaryawan)
            ? lateRowStyle
            : onTimeRowStyle;

          for (let col = 0; col < 6; col++) {
            applyCellStyle(getCellRef(currentRow, col), styleToApply);
          }
          masukRowIndex++;
        });
      });

    // Apply styles - Karyawan Pulang
    for (let col = 0; col < 6; col++) {
      applyCellStyle(
        getCellRef(pulangTitleRow, col),
        sectionTitleStyle(COLORS.LIGHT_GREEN),
      );
      applyCellStyle(
        getCellRef(pulangHeaderRow, col),
        tableHeaderStyle(COLORS.PRIMARY_GREEN, COLORS.WHITE),
      );
    }
    for (let row = pulangDataStartRow; row < lemburTitleRow - 1; row++) {
      for (let col = 0; col < 6; col++) {
        applyCellStyle(getCellRef(row, col), dataRowStyle);
      }
    }

    // Apply styles - Karyawan Lembur
    for (let col = 0; col < 6; col++) {
      applyCellStyle(
        getCellRef(lemburTitleRow, col),
        sectionTitleStyle(COLORS.LIGHT_YELLOW),
      );
      applyCellStyle(
        getCellRef(lemburHeaderRow, col),
        tableHeaderStyle(COLORS.YELLOW, COLORS.BLACK),
      );
    }
    
    const lemburEndRow = karyawanIzin.length > 0 ? izinTitleRow! - 1 : tidakMasukTitleRow - 1;
    for (let row = lemburDataStartRow; row < lemburEndRow; row++) {
      for (let col = 0; col < 6; col++) {
        applyCellStyle(getCellRef(row, col), dataRowStyle);
      }
    }

    // Apply styles - Karyawan Izin (BARU)
    if (karyawanIzin.length > 0) {
      for (let col = 0; col < 6; col++) {
        applyCellStyle(
          getCellRef(izinTitleRow!, col),
          sectionTitleStyle(COLORS.LIGHT_BLUE),
        );
        applyCellStyle(
          getCellRef(izinHeaderRow!, col),
          tableHeaderStyle(COLORS.BLUE, COLORS.WHITE),
        );
      }
      for (let row = izinDataStartRow!; row < tidakMasukTitleRow - 1; row++) {
        for (let col = 0; col < 6; col++) {
          applyCellStyle(getCellRef(row, col), dataRowStyle);
        }
      }
    }

    // Apply styles - Karyawan Tidak Masuk
    for (let col = 0; col < 4; col++) {
      applyCellStyle(
        getCellRef(tidakMasukTitleRow, col),
        sectionTitleStyle(COLORS.LIGHT_RED),
      );
      applyCellStyle(
        getCellRef(tidakMasukHeaderRow, col),
        tableHeaderStyle(COLORS.RED, COLORS.WHITE),
      );
    }
    for (let row = tidakMasukDataStartRow; row < worksheetData.length; row++) {
      for (let col = 0; col < 4; col++) {
        applyCellStyle(getCellRef(row, col), dataRowStyle);
      }
    }

    // Add merges for titles
    getMerges().push({ s: { r: 0, c: 0 }, e: { r: 0, c: 5 } });
    getMerges().push({
      s: { r: masukTitleRow, c: 0 },
      e: { r: masukTitleRow, c: 5 },
    });
    getMerges().push({
      s: { r: pulangTitleRow, c: 0 },
      e: { r: pulangTitleRow, c: 5 },
    });
    getMerges().push({
      s: { r: lemburTitleRow, c: 0 },
      e: { r: lemburTitleRow, c: 5 },
    });
    
    if (karyawanIzin.length > 0) {
      getMerges().push({
        s: { r: izinTitleRow!, c: 0 },
        e: { r: izinTitleRow!, c: 5 },
      });
    }
    
    getMerges().push({
      s: { r: tidakMasukTitleRow, c: 0 },
      e: { r: tidakMasukTitleRow, c: 3 },
    });

    // Add merges for gerai cells - Masuk
    let currentRow = masukDataStartRow;
    Object.keys(masukByGerai)
      .sort()
      .forEach((gerai) => {
        const count = masukByGerai[gerai].length;
        if (count > 1) {
          getMerges().push({
            s: { r: currentRow, c: 1 },
            e: { r: currentRow + count - 1, c: 1 },
          });
        }
        currentRow += count;
      });

    // Add merges for gerai cells - Pulang
    currentRow = pulangDataStartRow;
    Object.keys(pulangByGerai)
      .sort()
      .forEach((gerai) => {
        const count = pulangByGerai[gerai].length;
        if (count > 1) {
          getMerges().push({
            s: { r: currentRow, c: 1 },
            e: { r: currentRow + count - 1, c: 1 },
          });
        }
        currentRow += count;
      });

    // Add merges for gerai cells - Lembur
    currentRow = lemburDataStartRow;
    Object.keys(lemburByGerai)
      .sort()
      .forEach((gerai) => {
        const count = lemburByGerai[gerai].length;
        if (count > 1) {
          getMerges().push({
            s: { r: currentRow, c: 1 },
            e: { r: currentRow + count - 1, c: 1 },
          });
        }
        currentRow += count;
      });

    // Add merges for gerai cells - Izin (BARU)
    if (karyawanIzin.length > 0) {
      currentRow = izinDataStartRow!;
      Object.keys(izinByGerai)
        .sort()
        .forEach((gerai) => {
          const count = izinByGerai[gerai].length;
          if (count > 1) {
            getMerges().push({
              s: { r: currentRow, c: 1 },
              e: { r: currentRow + count - 1, c: 1 },
            });
          }
          currentRow += count;
        });
    }

    // Add merges for gerai cells - Tidak Masuk
    currentRow = tidakMasukDataStartRow;
    Object.keys(tidakMasukByGerai)
      .sort()
      .forEach((gerai) => {
        const count = tidakMasukByGerai[gerai].length;
        if (count > 1) {
          getMerges().push({
            s: { r: currentRow, c: 1 },
            e: { r: currentRow + count - 1, c: 1 },
          });
        }
        currentRow += count;
      });

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
                        {absensi.alasan_izin_kerja && <span>
                        <p className="font-semibold text-sm tablet:text-lg">
                          Alasan Izin :{" "}
                        </p>
                        <p className="text-sm tablet:text-lg">
                          {absensi.alasan_izin_kerja.toUpperCase()}
                        </p>
                        </span>}
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
                            } ${absensi.alasan_izin_kerja ? "bg-yellow-500" : ""} p-2 w-fit rounded-lg`}
                          >
                            {absensi.alasan_izin_kerja&&"IZIN"} {absensi.waktu}
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
