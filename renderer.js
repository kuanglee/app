const { ipcRenderer } = require('electron');

document.getElementById('uploadBtn').addEventListener('click', () => {
    console.log(3333)
    const fileInput = document.getElementById('fileInput');
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const filePath = file.path;

        // Send the file path to the main process
        ipcRenderer.send('upload-file', filePath);
    } else {
        alert('Please select a file to upload.');
    }
});