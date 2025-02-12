import { useEffect, useState } from "react";
import { getDataKunjungan } from "../../firebase/service";
import { CheckBadgeIcon } from "@heroicons/react/24/outline";

export default function DataKunjungan({ email }: any) {
  const date = new Date();
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const formattedDate = `${day}-${month}-${year}`;
  const [data, setData] = useState<any>([]);

  useEffect(() => {
    getDataKunjungan("kunjungan-karyawan-" + formattedDate).then((res: any) => {
      const data = res.filter((result: any) => result.email == email);
      setData(data);
    });
  }, []);
  return (
    <>
    {data.length>0&&(<main className="bg-yellow-400 rounded-lg py-4 px-5 mt-5">
      <div className="flex flex-col gap-4">
        {data.map((result: any, i: number) => (
          <div key={i}>
            <p className="text-lg flex gap-2 font-bold"><CheckBadgeIcon className="w-5 text-green-800"></CheckBadgeIcon> {result.deskripsi_kunjungan}</p>
          </div>
        ))}
      </div>
    </main>)}
    </>
  );
}
