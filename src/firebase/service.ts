import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { firestore } from "./init";
import Swal from "sweetalert2";

interface Karyawan {
  email: string;
  nama: string;
  gerai: string;
  divisi: string;
}

export async function getDaftarKaryawan() {
  try {
    const snapshot = await getDocs(collection(firestore, "daftar-pegawai"));
    const data = snapshot.docs.map((doc) => {
      return { ...doc.data(), id: doc.id };
    });
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

export async function getGerai() {
  const result: any = await getDocs(collection(firestore, "gerai"));
  return result.docs.map((doc: any) => doc.data());
}

export async function addGerai(data: any) {
  await addDoc(collection(firestore, "gerai"), { ...data });
}


export async function handleDeleteKaryawan(id: string) {
  await deleteDoc(doc(firestore, "daftar-pegawai", id));
  return { message: "Data berhasil dihapus!" };
}
export async function handleUpdateKaryawan(id: number, data: Karyawan) {
  await updateDoc(doc(firestore, "daftar-pegawai", id.toString()), {
    ...data,
  });
  return { message: "Data berhasil diubah!" };
}

export async function handleSubmitAbsensi(data: any, collectionName: string) {
  const result: any = await getDoc(doc(firestore, collectionName, data.email.toLowerCase()));
  data = data.alasan_izin_kerja?{
    email: data.email.toLowerCase(),
    alamat: data.alamat,
    divisi: data.divisi,
    nama: data.nama,
    waktu: data.waktu,
    alasan_izin_kerja: data.alasan_izin_kerja,
    overtime: data.overtime,
    img: data.img,
  }:{
    email: data.email.toLowerCase(),
    alamat: data.alamat,
    divisi: data.divisi,
    nama: data.nama,
    waktu: data.waktu,
    img: data.img,
    overtime: data.overtime
  };
  let snapshot = result.data();
  snapshot?.data.push(data);
  if (snapshot) {
    const newDocRef = doc(firestore, collectionName, data.email.toLowerCase());
    await setDoc(newDocRef, snapshot);
  } else {
    const newDocRef = doc(firestore, collectionName, data.email.toLowerCase());
    await setDoc(newDocRef, { data: [data] });
  }
}

export async function handleAddKaryawan(data: any) {
  try {
    const isKodeExist= await getDocs(query(collection(firestore, "daftar-pegawai"), where("kode", "==", data.kode)));
    if(isKodeExist.docs.length>0) return Swal.fire("Error", "Kode sudah terpakai!", "error");
    await addDoc(collection(firestore, "daftar-pegawai"), data);
    return { message: "Berhail register!" };
  } catch (err) {
    console.error(err);
  }
}

export async function getPersonalKaryawan(email: string | null) {
  try {
    let snapshot: any;
    snapshot = await getDocs(
      query(
        collection(firestore, "daftar-pegawai"),
        where("email", "==", email?.toUpperCase())
      )
    );
    if (snapshot.docs.length === 0)
      snapshot = await getDocs(
        query(
          collection(firestore, "daftar-pegawai"),
          where("email", "==", email?.toLowerCase())
        )
      );
    if (snapshot.docs.length === 0) return "TIDAK ADA DATA";
    const data = snapshot.docs.map((doc: any) => (doc.id, doc.data()));
    return data.length > 1 ? data[1] : data[0];
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

export async function getDataAbsensi(collectionName: string, email: string) {
  try {
    const result: any = await getDoc(
      doc(firestore, collectionName, email.toLowerCase())
    );
    return result.data();
  } catch (error) {
    return { error };
  }
}

export async function getDataSemuaAbsensiKaryawan(collectionName: string) {
  try {
    const result: any = await getDocs(collection(firestore, collectionName));
    return result.docs.map((doc: any) => doc.data());
  } catch (error) {
    return { error };
  }
}

export async function addHariLibur(collectionName: string, data: any) {
  const newDocRef = doc(firestore, collectionName, "libur");
  await setDoc(newDocRef, data);
  return { message: "Berhail register!" };
}
export async function getHariLibur() {
  const result: any = await getDoc(doc(firestore, "hari-libur", "libur"));
  return result.data();
}
export async function setKunjungan(collectionName: string, data: any) {
  data = {
    email: data.email,
    alamat: data.alamat || "Alamat tidak tersedia",
    divisi: data.divisi || "Divisi tidak diketahui",
    nama: data.nama || "Nama tidak tersedia",
    waktu: data.waktu || new Date().toISOString(),
    img: data.img || "default_image_url",
    deskripsi_kunjungan: data.deskripsi_kunjungan || "Deskripsi tidak tersedia",
  };
  await addDoc(collection(firestore, collectionName), data);
  return { message: data };
}

export async function getDataKunjungan(collectionName: string) {
  const result: any = await getDocs(collection(firestore, collectionName));
  return result.docs.map((doc: any) => doc.data());
}
