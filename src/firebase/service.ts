import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { firestore } from "./init";

export async function getDaftarKaryawan() {
  try {
    const snapshot = await getDocs(collection(firestore, "daftar-karyawan"));
    const data = snapshot.docs.map((doc) => doc.data());
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

export async function handleSubmitAbsensi(data: any, collectionName: string) {
  const result: any = await getDoc(doc(firestore, collectionName, data.email));
  data = {
    email: data.email,
    alamat: data.alamat,
    divisi: data.divisi,
    nama: data.nama,
    waktu: data.waktu,
    img: data.img,
  };
  let snapshot = result.data();
  snapshot?.data.push(data);
  if (snapshot) {
    const newDocRef = doc(firestore, collectionName, data.email);
    await setDoc(newDocRef, snapshot);
  } else {
    const newDocRef = doc(firestore, collectionName, data.email);
    await setDoc(newDocRef, { data: [data] });
  }
}

export async function handleAddKaryawan(data: any) {
  try {
    await addDoc(collection(firestore, "daftar-karyawan"), data);
    return { message: "Berhail register!" };
  } catch (err) {
    console.error(err);
  }
}

export async function getPersonalKaryawan(email: string | null) {
  try {
    const snapshot = await getDocs(
      query(
        collection(firestore, "daftar-karyawan"),
        where("email", "==", email)
      )
    );
    if (snapshot.empty) return "TIDAK ADA DATA";
    const data = snapshot.docs.map((doc) => (doc.id, doc.data()));
    return data.length > 1 ? data[1] : data[0];
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

export async function getDataAbsensi(collectionName: string, email: string) {
  try {
    const result: any = await getDoc(doc(firestore, collectionName, email));
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
  const newDocRef = doc(firestore, collectionName, data.email);
    await setDoc(newDocRef, data);
    return { message: "Berhasil!" };
}