import React, { useEffect, useState } from "react";
import axios from "axios";

const AppsDataSet = () => {
  const [appData, setAppData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/data");
        setAppData(response.data);
      } catch (error) {
        console.error("Error fetching app data:", error);
      }
    };
  
    fetchData();
  }, [appData]);

  const handleDownload = async (filePath) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/download?filePath=${filePath}`,
        {
          responseType: "blob",
        }
      );
      const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", filePath);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading dump file:", error);
    }
  };

  return (
    <div className="DataSet-container">
      {Object.keys(appData).map((appId) => (
        <div key={appId} className="AppsData-container">
          <img src={appData[appId].icon} alt="App Icon" />
          <div>
            <h3>{appData[appId].name}</h3>
            <p>
              {`Version: ${appData[appId].version}`}
              <br></br> {`Engine: ${appData[appId].Engine}`}
            </p>
            {appData[appId].filePath? (          <button onClick={() => handleDownload(appData[appId].filePath)}>
            Download
          </button>) : (<></>)}

          </div>
        </div>
      ))}
    </div>
  );
};

export default AppsDataSet;
