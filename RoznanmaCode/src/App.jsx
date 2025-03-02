import axios from "axios";
import React, { useEffect, useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import DropdownForm from "./components/Dropdown";
import { InputField } from "./components/InputFiles";
import PreviewModal from "./components/PreviewModal";

const App = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl,setPreviewUrl] =useState("");

  const [formData, setFormData] = useState({
    folderName: "",
    fileName: "",
    letterHead: "",
    createType: "",    
    claimantcompany: "",
    socFile: "",
    LegalPerson:"",
    noticeDate: "",
  });

  const [file, setFile] = useState(null);
  const bucketName = import.meta.env.VITE_APP_BUCKET_NAME;
  const folderName = import.meta.env.VITE_APP_FOLDER_NAME;
  const fileName = import.meta.env.VITE_APP_FILE_NAME;
  const BackendUrl = import.meta.env.VITE_APP_BACKEND_URL;
  const baseUrlS3 = import.meta.env.VITE_APP_S3_BASE_URL;
 
  const handleCreateAll = async (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    try {
      const response = await axios.post(
        `${BackendUrl}/createRozanamaNotice`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      alert("Data saved successfully");
      setdata(response.data);
      console.log(response);
      console.log("Response Recieved Successfully", response.data);


     
     
  } catch (error) {
    console.error("Error sending data",error);
  }
    
    };
    
  


  const handleDownloadAll = () => {
    console.log("Download All Clicked");
  };
  const handlePreview = async () => {
   // console.log("Preview Button Clicked");
   // API Calling
   try {
    console.log("Making API call to get presigned URL...");
     const res = await axios.post(`${BackendUrl}/getpreviewUrl`,{folder:formData?.folderName});
      setPreviewUrl(res.data?.key);

      const previewKey = res.data?.key;
      if(previewKey){
        console.log("Preview key :", previewKey);
        setModalIsOpen(true);
      }

    
   } catch (error) {
    console.error("Error in handlePreview:", err);
    alert("No folder exists or error occurred: " + (err.message || "Unknown error"));

    
   }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value, "name, value");
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleUpload = async () => {
    console.log("Upload Button  Clicked");

    try {
      console.log("Bucket Name:", import.meta.env.VITE_APP_BUCKET_NAME);
      console.log("Folder Name:", import.meta.env.VITE_APP_FOLDER_NAME);
      console.log("File Name:", import.meta.env.VITE_APP_FILE_NAME);
      console.log("Making API call to get presigned URL...");

      const { data } = await axios.post(
        `${BackendUrl}/csvUploadTos3Api`,

        {
          bucketName: bucketName,
          folderName: folderName,
          fileName: fileName,
        }
      );
       console.log("Upload Button  Clicked");

      console.log(data, "Data recieved");

      if (!data.presignedUrl) {
        throw new Error("Failed to get presigned URL");
      }

      await axios.put(data.presignedUrl, file, {
        headers: {
          "Content-Type": "text/csv",
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );

          setUploadProgress(progress);
        },
      });
      setTimeout(() => {
        setUploadProgress(0);
      }, 1000);
    } catch (error) {
      console.log("Error Occurred ", error);
      alert("Failed to upload file");
    }
  };
  const createTypeOption = ["Select Option", "one", "all"];
  const letterheadOption = [
    "Select Option",
    "Delhi",
    "Mumbai",
    "Pune",
    "Thane",
    "Gurgaon",
    "Chennai",
    "Ahmedabad",
    "Ambernath",
  ];
  const hearingTypeOption = [
    "Select Option",
    "Virtual Hearing",
    "Physical Hearing",
    "Both",
  ];
  const disputeTypeOption = ["Select Option", "Arbitration", "Conciliation"];
  const StatementofClaimantOption = ["Select Option", "Yes", "No"];
  const LegalPersonOption = ["Select Option", "vishal", "vipin"];

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      if (selectedFile.type === "text/csv") {
        setFormData((prev) => ({
          ...prev,
          fileName: selectedFile.name,
        }));
        console.log("File selected successfully:", selectedFile.name);
      } else {
        alert("Please upload a CSV file");
        setFormData((prev) => ({
          ...prev,
          fileName: ''
        }));
        setFile(null);
      }
    }
  };

  useEffect(() => {
    console.log(formData, "formdata");
  }, [formData]);

  return (
<div className="d-flex flex-column justify-content-center align-items-center  bg-light p-4"
  style={{
    height:"100vh",
    width:"60vw"
    >
  <div
    className="bg-white p-5 rounded shadow text-center w-100"
    style={{
      maxWidth: "900px",
      height: "100%",
      maxHeight: "90vh",
      overflowY: "auto",
    }}
  >
        <h1 className="h2 fw-bold mb-4 text-center">CSV Uploader</h1>
        <form className="w-100">
          <input
            type="file"
            name="filename"
            onChange={handleFileChange}
            accept=".csv"
            className="form-control form-control-lg mb-3"
          />
        </form>
  
          <DropdownForm
            createType={createTypeOption}
            letterHead={letterheadOption}
            hearingType={hearingTypeOption}
            disputeType={disputeTypeOption}
            StatementofClaimant={StatementofClaimantOption}
            LegalPerson={LegalPersonOption}
            onDropdownchange={handleInputChange}
            fieldNames={[
              "createType",
              "letterHead",
              "hearingType",
              "rozanamaType",
              "socFile",
              "LegalPerson",
            ]}
          />
  
          <InputField
            label="noticeDate"
            id="noticeDate"
            name="noticeDate"
           input type="date"
          // showDate={true}
            onChange={handleInputChange}          />
  
          <InputField
            label="Enter claimantcompany"
            id="cc"
            name="claimantcompany"
            placeholder="Write name"
            onChange={handleInputChange}
          />
  
          <InputField
            label="Enter Folder Name"
            id="folder"
            name="folderName"
            placeholder="Write Folder Name"
            onChange={handleInputChange}
          />
  
          <div className="position-absolute bottom-0 start-0 m-3 d-flex gap-2">
            <button
              onClick={handlePreview}
              className="btn btn-warning btn-lg text-white fw-bold"
            >
              Preview
            </button>
            <button
              onClick={handleUpload}
              className="btn btn-primary btn-lg text-white fw-bold"
            >
              Upload
            </button>
            {uploadProgress > 0 && (
              <div className="mt-2 w-50">
                <p>Upload Progress: {uploadProgress}%</p>
                <div className="progress" style={{ height: "15px" }}>
                  <div
                    className="progress-bar bg-primary"
                    role="progressbar"
                    style={{ width: `${uploadProgress}%` }}
                    aria-valuenow={uploadProgress}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  />
                </div>
              </div>
            )}
          </div>
  
          <div className="position-absolute bottom-0 end-0 m-3 d-flex gap-2">
            <button
              onClick={handleCreateAll}
              className="btn btn-success btn-lg text-white fw-bold"
            >
              Create All
            </button>
            <button
              onClick={handleDownloadAll}
              className="btn btn-primary btn-lg text-white fw-bold"
            >
              Download All
            </button>
          </div>
        </div>
        {previewUrl ? (
          <PreviewModal
            
            isOpen={modalIsOpen}
            onRequestClose={() => setModalIsOpen(false)}
            previewKey={previewUrl}
          />
        ) : (
          ""
        )}
      </div>
    );
  }


  export default App;
