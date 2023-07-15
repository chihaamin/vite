import express from "express";
import fileUpload from "express-fileupload";
import path from 'path';
import fs from 'fs';
import gplay from 'google-play-scraper';

const fileExtLimiter = (allowedExtArray) => {
  return (req, res, next) => {
    const files = req.files;

    const fileExtensions = [];
    Object.keys(files).forEach(key => {
      fileExtensions.push(path.extname(files[key].name));
    });

    // Are the file extensions allowed? 
    const allowed = fileExtensions.every(ext => allowedExtArray.includes(ext));

    if (!allowed) {
      const message = `Upload failed. Only ${allowedExtArray.toString()} files allowed.`.replaceAll(",", ", ");

      return res.status(422).json({ status: "error", message });
    }

    next();
  }
};

const app = express();
const PORT = process.env.PORT || 5000;

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// File Upload
app.post('/upload',
  fileUpload({ createParentPath: true }),
  async (req, res) => {
    try {
      const files = req.files;
      const apkData = JSON.parse(req.body.apkData); // Assuming you send the ApkData as a stringified JSON in the request body

      if (files && files.file) {
        // File upload
        const uploadedFile = files.file; // Assuming the file input field name is 'file'

        const filePath = path.join('./src', 'dumps', uploadedFile.name);
        uploadedFile.mv(filePath, (err) => {
          if (err) return res.status(500).json({ status: "error", message: err });

          const jsonFilePath = path.join('./src', 'dumps', 'uploadedData.json');

          // Check if the JSON file already exists
          if (fs.existsSync(jsonFilePath)) {
            const existingData = JSON.parse(fs.readFileSync(jsonFilePath));

            // Update or add the data based on the appId
            const updatedData = {
              ...existingData,
              [apkData.appId]: {
                filePath,
                name: apkData.title,
                icon: apkData.icon,
                version: apkData.version,
                Engine: apkData.Engine
              }
            };

            fs.writeFileSync(jsonFilePath, JSON.stringify(updatedData));

            return res.json({ status: 'success', message: 'File uploaded successfully' });
          } else {
            const jsonData = {
              [apkData.appId]: {
                filePath,
                icon: apkData.icon,
                version: apkData.version,
                Engine: apkData.Engine
              }
            };

            fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData));

            return res.json({ status: 'success', message: 'File uploaded successfully' });
          }
        });
      } else {
        // Data without a file
        const jsonFilePath = path.join('./src', 'dumps', 'uploadedData.json');

        // Check if the JSON file already exists
        if (fs.existsSync(jsonFilePath)) {
          const existingData = JSON.parse(fs.readFileSync(jsonFilePath));

          // Update or add the data based on the appId
          const updatedData = {
            ...existingData,
            [apkData.appId]: {
              name: apkData.title,
              icon: apkData.icon,
              version: apkData.version,
              Engine: apkData.Engine
            }
          };

          fs.writeFileSync(jsonFilePath, JSON.stringify(updatedData));

          return res.json({ status: 'success', message: 'Data uploaded successfully' });
        } else {
          const jsonData = {
            [apkData.appId]: {
              name: apkData.title,
              icon: apkData.icon,
              version: apkData.version,
              Engine: apkData.Engine
            }
          };

          fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData));

          return res.json({ status: 'success', message: 'Data uploaded successfully' });
        }
      }
    } catch (error) {
      return res.status(500).json({ status: "error", message: error.message });
    }
  }
);


// Web Scraping
app.get('/search', async (req, res) => {
  const searchTerm = req.query.q;

  try {
    const results = await gplay.search({
      term: searchTerm.toString(),
      num: 5,
      fullDetail: true
    });

    return res.json(results);
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
});

// Fetch data from JSON file
app.get('/data', (req, res) => {
  try {
    const jsonFilePath = path.join('./src', 'dumps', 'uploadedData.json');
    const jsonData = JSON.parse(fs.readFileSync(jsonFilePath));

    return res.json(jsonData);
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
});
app.get('/download', (req, res) => {
    const filePath = req.query.filePath;
    const absoluteFilePath = filePath
    res.download(absoluteFilePath);
  });
  

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
