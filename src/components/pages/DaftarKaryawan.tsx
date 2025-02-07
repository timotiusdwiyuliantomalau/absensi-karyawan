import { useEffect, useState } from "react";
import { getDaftarKaryawan } from "../../firebase/service";
import { RiAccountPinCircleLine } from "react-icons/ri";
import { GrUserWorker } from "react-icons/gr";
import { Link } from "react-router-dom";

const DaftarKaryawan = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("ALL");
  const [daftarKaryawan, setDaftarKaryawan] = useState<any>([]);

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
    getDaftarKaryawan().then((res: any) => {
      if (selectedBranch === "ALL") {
        let daftarKaryawanSementara = res;
        let arr:any=[];
        daftarKaryawanSementara.forEach((karyawan: any) => {
          if(arr.length===0) return arr.push(karyawan);
          res=arr.filter((filterKaryawan: any) => filterKaryawan.email === karyawan.email);
          if(res.length===0) arr.push(karyawan)
        });
        setDaftarKaryawan(arr);
      } else {
        let daftarKaryawanSementara = res;
        let arr:any=[];
        daftarKaryawanSementara.forEach((karyawan: any) => {
          if(arr.length===0) return arr.push(karyawan);
          res=arr.filter((filterKaryawan: any) => filterKaryawan.email === karyawan.email);
          if(res.length===0) arr.push(karyawan)
        });
        const listKaryawan = arr.filter(
          (karyawan: any) =>
            karyawan.gerai.toLowerCase() === selectedBranch.toLowerCase()
        );
        setDaftarKaryawan(listKaryawan);
      }
    });
  }, [selectedBranch]); // Dependency pada selectedBranch saja

  return (
    <div className="min-h-screen bg-gray-50">
      <div>
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#EA9146] py-8 px-7 w-full">
          <div className="flex items-center gap-3">
            <GrUserWorker className="text-5xl text-white" />
            <h1 className="text-3xl font-bold text-white">Daftar Karyawan</h1>
          </div>

          <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Cari karyawan..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg
                className="w-5 h-5 absolute left-3 top-2.5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            <select
              className="w-full sm:w-40 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
          {daftarKaryawan.map((employee: any, i: number) => (
            <Link to={`/daftar-karyawan/${employee.email}`}
              key={i}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6 flex items-start gap-4">
                <RiAccountPinCircleLine className="w-16 h-16 rounded-full object-cover border-2 border-blue-100" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {employee.nama.toUpperCase()}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {employee.divisi.toUpperCase()}
                  </p>
                  <div className="mt-3 flex items-center gap-1">
                    <svg
                      className="w-5 h-5"
                      fill="red"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span className="text-sm text-gray-600">
                      {employee.gerai}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DaftarKaryawan;
