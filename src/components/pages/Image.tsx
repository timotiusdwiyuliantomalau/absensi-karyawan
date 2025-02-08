import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { Cloudinary } from '@cloudinary/url-gen';
import { AdvancedImage } from '@cloudinary/react';

const Image = () => {
  const [imageUrl, setImageUrl] = useState(null); // State untuk menyimpan URL gambar yang di-upload

  // Fungsi untuk meng-handle file yang dipilih
  const onDrop = (acceptedFiles:any) => {
    const formData = new FormData();
    formData.append('file', acceptedFiles[0]);  // Menambahkan file yang diupload ke form data
    formData.append('upload_preset', "absensi-ggsuspension");  // Gantilah dengan upload preset Anda

    // Mengirim file ke Cloudinary menggunakan API POST
    axios.post('https://api.cloudinary.com/v1_1/ddc5f0ahw/image/upload', formData)
      .then((response:any) => {
        const { secure_url } = response.data;  // Mengambil URL gambar yang di-upload
        setImageUrl(secure_url);  // Menyimpan URL gambar
      })
      .catch(err => console.error(err));
  };

  // Menyiapkan dropzone untuk memilih file
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  // Setup Cloudinary untuk menampilkan gambar yang sudah di-upload
  const cld = new Cloudinary({ cloud: { cloudName: 'ddc5f0ahw' } });
  const img = imageUrl ? cld.image(imageUrl) : null;

  return (
    <div>
      {/* Dropzone untuk memilih gambar */}
      <div {...getRootProps()} style={{ border: '2px dashed #ccc', padding: '20px', cursor: 'pointer' }}>
        <input {...getInputProps()} />
        <p>Drag & Drop an image or click to select one</p>
      </div>

      {/* Jika gambar di-upload, tampilkan gambar menggunakan AdvancedImage */}
      {img && (
        <div>
          <h2>Uploaded Image:</h2>
          <AdvancedImage cldImg={img} />
        </div>
      )}
    </div>
  );
};

export default Image;
