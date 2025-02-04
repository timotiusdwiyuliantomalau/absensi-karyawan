import { useEffect, useState } from "react";
import { getDaftarKaryawan } from "../../firebase/service";

export default function DaftarKaryawan() {
  const [daftarKaryawan, setDaftarKaryawan] = useState<any>([]);

  useEffect(() => {
    getDaftarKaryawan().then((res) => {
        console.log(res);
        setDaftarKaryawan(res)});
  }, []);
  return (
    <>
      {daftarKaryawan.length > 0 &&
        daftarKaryawan.map((karyawan: any,i:number) => (
          <div key={i} className="flex gap-4">
            <p>{karyawan.nama}</p>
            <p>{karyawan.gerai}</p>
          </div>
        ))}
    </>
  );
}
