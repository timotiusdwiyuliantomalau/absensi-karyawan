// Array nama hari dan bulan
const hari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const bulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

// Membuat objek Date untuk mendapatkan tanggal hari ini
const tanggal = new Date();

// Mendapatkan hari, tanggal, bulan, dan tahun
const hariNama = hari[tanggal.getDay()];
const tanggalHari = tanggal.getDate().toString().padStart(2, '0');  // Menambahkan '0' di depan jika tanggal hanya 1 digit
const bulanNama = bulan[tanggal.getMonth()].substring(0,3);
const tahun = tanggal.getFullYear();

// Format tampilan
export const tanggalHariIni = `${hariNama}, ${tanggalHari} ${bulanNama} ${tahun}`;

