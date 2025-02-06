import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { firestore } from "./init";
import Papa from "papaparse";

export async function getDaftarKaryawan() {
  try {
    const snapshot = await getDocs(collection(firestore, "daftar-karyawan"));
    const data = snapshot.docs.map((doc) => doc.data());
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

export async function handleSubmitAbsensi(
  collectionName: string,
  data: any,
  tanggal: string
) {
    const result: any = await getDoc(doc(firestore, collectionName, tanggal));
    data = {
      email: data.email,
      alamat: data.alamat,
      divisi: data.divisi,
      nama: data.nama,
      waktu: data.waktu,
    };
    let snapshot = result.data();
    snapshot?.data.push(data);
    if(snapshot){
      const newDocRef = doc(firestore, collectionName, tanggal);
      await setDoc(newDocRef, snapshot);
    }else{
      const newDocRef = doc(firestore, collectionName, tanggal);
      await setDoc(newDocRef, { data:[data] });
    }
}

export async function importCSV(file: any) {
  Papa.parse(file, {
    complete: async (results) => {
      const csvData = results.data.slice(1).filter((row: any) => row[2]);
      const batch = writeBatch(firestore);
      const collectionRef = collection(firestore, "daftar-karyawan");
      csvData.forEach((row: any) => {
        const docRef = doc(collectionRef, row[0].trim());
        batch.set(docRef, {
          divisi: row[1].trim(),
          nama: row[2].trim(),
          gerai: row[4].trim(),
        });
      });

      try {
        await batch.commit();
        console.log("Berhasil import!");
      } catch (error) {
        console.error("Gagal import:", error);
      }
    },
    error: (error: any) => {
      console.error("Error parsing CSV:", error);
    },
  });
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

export async function getDataAbsensi(tanggal: string) {
  try {
    const result: any = await getDoc(doc(firestore, "absensi-pegawai-bekasi", tanggal));
    return (result.data());
  }
  catch (error) {
    return {error};
  }
}