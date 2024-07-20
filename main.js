require('dotenv').config(); // Load environment variables from .env file
const { app, BrowserWindow, ipcMain } = require('electron');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');


function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.on('upload-file', (event, filePath) => {
  console.log('Received file path:', filePath);
  const apiKey = process.env.API_KEY;
  const form = new FormData();
  const fileStream = fs.createReadStream(filePath);
  form.append('file_upload', fileStream);
  form.append('api_key', apiKey);

  axios.post('http://localhost/api/v1/import-examinations', form, {
    headers: form.getHeaders()
  })
      .then(response => {
        console.log('File uploaded successfully:', response.data);
      })
      .catch(error => {
        console.error('Error uploading file:', error);
      });
});
