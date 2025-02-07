const base64ToFile = (base64String: any, filename: string) => {
  const arr = base64String.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
};

export const uploadImage = async (
  imageBase64: any,
  email: string,
  waktu: string
) => {
  const base64String = imageBase64;

  if (!base64String) {
    alert("Pilih gambar terlebih dahulu!");
    return;
  }
  const imageFile = base64ToFile(base64String, `${email + waktu}.jpg`);

  const formData = new FormData();
  formData.append("image", imageFile);

  try {
    const response = await fetch(
      "https://api.imgbb.com/1/upload?key=538eb65830bcd7ebf806679f3ee2ca91",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();
    if (data.success) {
      return data.data.display_url;
    } else {
      alert("Upload gagal! Coba lagi.");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Terjadi kesalahan saat upload.");
  }
};
