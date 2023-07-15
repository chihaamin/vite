import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dropzone from 'react-dropzone';
import ApkInfo from './apkscrape.jsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FileUploader = () => {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [error, setError] = useState('');
  const [ApkData, setApkData] = useState('');
  const [apkInfoKey, setApkInfoKey] = useState(0);

  useEffect(() => {
    if (ApkData && file) {
      setFile(null);
      setError('');
    }
  }, [ApkData]);

  useEffect(() => {
    if (uploadStatus === 'success') {
      setFile(null);
      setUploadStatus('');
      setError('');
      setApkData('')
      toast.success('Success!', {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      setApkInfoKey((prevKey) => prevKey + 1); // Update the key to reset ApkInfo
    }
  }, [uploadStatus]);

  const handleDrop = (acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile && selectedFile.name.endsWith('.cs')) {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Invalid file format. Please select a .cs file.');
    }
    setUploadStatus('');
  };

  const handleUploadF = async () => {
    try {
      if (!file || !ApkData) {
        throw new Error('No file or ApkData selected.');
      }

      const formData = new FormData();
      formData.append('file', file, `${ApkData.appId}.cs`);
      formData.append('apkData', JSON.stringify(ApkData));

      const response = await axios.post('http://localhost:5000/upload', formData);
      setUploadStatus(response.data.status);
      setError('');
    } catch (error) {
      setUploadStatus('');
      setError('Error uploading file: ' + error.message);
    }
  };
  const handleUploadI = async () => {
    try {
      if (!ApkData || !ApkData.Engine) {
        throw new Error('No Engine or Apk selected.');
      }

      const formData = new FormData();
      formData.append('apkData', JSON.stringify(ApkData));

      const response = await axios.post('http://localhost:5000/upload', formData);
      setUploadStatus(response.data.status);
      setError('');
    } catch (error) {
      setUploadStatus('');
      setError('Error updating info: ' + error.message);
    }
  };

  const acceptTextPlain = { 'text/cs': ['.cs'] };

  const handleSearch = (e) => {
    setApkData(e);
  };

  const knownEngines = [
    { name: 'Unity', library: 'LibIl2cpp.so' },
    { name: 'Unreal Engine', library: 'LibUE4.so' },
    { name: 'CryEngine', library: 'LibCryEngine.so' },
    { name: 'GameMaker Studio', library: 'LibGMS.so' },
    { name: 'Cocos2d', library: 'libMyGame.so' },
    { name: 'Godot Engine', library: 'LibGodot.so' },
    { name: 'Phaser', library: 'LibPhaser.so' },
    { name: 'Lumberyard', library: 'LibLumberyard.so' },
    { name: 'Construct', library: 'LibConstruct.so' },
    { name: 'Defold', library: 'LibDefold.so' },
    { name: 'Corona SDK', library: 'LibCoronaSDK.so' },
    { name: 'Marmalade', library: 'LibMarmalade.so' },
    { name: 'GDevelop', library: 'LibGDevelop.so' },
    { name: 'RPG Maker', library: 'LibRPGMaker.so' },
    { name: 'Fusion', library: 'LibFusion.so' },
    { name: 'Adventure Game Studio', library: 'LibAGS.so' },
    { name: 'LÖVE', library: 'LibLOVE.so' },
    { name: 'GameSalad', library: 'LibGameSalad.so' },
    { name: 'Clickteam Fusion', library: 'LibClickteam.so' },
    { name: 'Stencyl', library: 'LibStencyl.so' },
    { name: 'Unknown', library: 'Unknown' }
  ];
  

  return (
    <div className="FileUploader">
      <div>
        <ApkInfo key={apkInfoKey} onSelectApk={handleSearch} />
      </div>
        {ApkData && (
      <div  className='Engine-container'>
        <select className="EngineUpdate"
          value={ApkData.Engine}
          onChange={(e) => setApkData({ ...ApkData, Engine: e.target.value })}
        >
          <option value="">-- Select Engine --</option>
          {knownEngines.map((engine) => (
            <option key={engine.name} value={engine.name} >
              {engine.name} ({engine.library})
            </option>
          ))}
        </select>
      </div>)}
      {ApkData && (
        <div className="Drop-Container">
          {ApkData.Engine === 'Unity' ? (<>
            <Dropzone onDrop={handleDrop} accept={acceptTextPlain}>
              {({ getRootProps, getInputProps }) => (
                <div {...getRootProps({ className: 'dropzone' })}>
                  <input {...getInputProps()} />
                  {file ? (
                    <p>Selected file: {file.name}</p>
                  ) : (
                    <p>
                      Drag and drop a "<strong>.CS</strong>" file here, or click to select a file.
                    </p>
                  )}
                </div>
              )}
            </Dropzone>
                      <button onClick={handleUploadF} disabled={!ApkData || !file}>
                      {uploadStatus ? uploadStatus : 'upload'}
                    </button>
                    {error && <p>{error}</p>}</>
          ) : (      
          <>            
          <button onClick={handleUploadI} disabled={!ApkData}>
            {uploadStatus ? uploadStatus : 'update info'}
          </button>
          {error && <p>{error}</p>}
          </>)}

        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default FileUploader;
