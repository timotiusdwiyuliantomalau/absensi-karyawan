import Swal from "sweetalert2";
import { getDaftarKaryawan } from "../firebase/service"

export const handleLogin=async (kode: string)=>{
    try{
        getDaftarKaryawan().then((karyawan: any) => {
            console.log(kode)
            const isAuth=karyawan.find((k: any) => k.kode == kode);
            if (isAuth) {
                localStorage.setItem("myData", JSON.stringify(isAuth));
                window.location.reload();
            }else{
                Swal.fire("Error", "Kode yang anda masukan salah", "error");
            }
        })
    }catch{

    }
}