import { useState, useRef } from "react";

const FileUploader = () => {
  const fileInputRef = useRef(null);
  const [blob, setBlob] = useState<any>(null);

  const handleFileChange = (event:any) => {
    const file = event.target.files[0];
    if (file) {
      const fileBlob = new Blob([file], { type: file.type });
      setBlob(fileBlob);
      console.log(fileBlob);
    }
  };

  return (
    <div>
      <input type="file" ref={fileInputRef} onChange={handleFileChange} />
      {blob && <p>File selected: {blob.type} (size: {blob.size} bytes)</p>}
    </div>
  );
};

export default FileUploader;