const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') }); // Load environment variables from .env file
const { app, BrowserWindow, ipcMain } = require('electron');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');


function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname,"build", '/Sunflower_from_Silesia2.jpg'),
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
  const url = process.env.ENDPOINT_API;

  const form = new FormData();
  const fileStream = fs.createReadStream(filePath);
  form.append('file_upload', fileStream);
  form.append('api_key', apiKey);

  axios.post(`${url}/import-examinations`, form, {
    headers: form.getHeaders()
  })
      .then(response => {
        event.sender.send('upload-response', { success: true, message: response.data.message, data: response?.data?.data });
        console.log('File uploaded successfully:', response.data);
      })
      .catch(error => {
        console.error('Error uploading file:', error);
        event.sender.send('upload-response', { success: false, message: error.data.message });
      });
});
