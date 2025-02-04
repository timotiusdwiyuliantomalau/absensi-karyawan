import React, { useState } from 'react';
import { importCSV } from '../../firebase/service';

const CsvUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    if (selectedFile) {
      setFile(selectedFile);
      importCSV(selectedFile);
    }
  };

  return (
    <div>
      <input
        type="file"
        id="csvFile"
        accept=".csv"
        onChange={handleFileChange}
      />
      {file && <p>File yang dipilih: {file.name}</p>}
    </div>
  );
};

export default CsvUploader;
