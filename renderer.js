const { ipcRenderer } = require('electron');

document.getElementById('fileInput').addEventListener('change', () => {
    const fileInput = document.getElementById('fileInput');
    const fileNameDiv = document.getElementById('fileName');

    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        fileNameDiv.textContent = `Selected file: ${file.name}`;
    } else {
        fileNameDiv.textContent = '';
    }
});

// Example function to trigger download
function downloadJsonFile(jsonData, fileName) {
    // Create a Blob from the JSON data
    if (jsonData === undefined){
        console.log("json data ", jsonData)

        return;
    }
    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    // Create a link element
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();

    // Cleanup
    URL.revokeObjectURL(url);
}

document.getElementById('uploadBtn').addEventListener('click', () => {
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

// Listen for upload response from main process
ipcRenderer.on('upload-response', (event, response) => {
    const fileInput = document.getElementById('fileInput');
    const fileNameDiv = document.getElementById('fileName');
    console.log(response)
    if (response.success) {
        alert(response.message);
        downloadJsonFile(response.data, 'data.json');
    } else {
        alert(response.message);
    }
    // Clear the file input after submission
    fileInput.value = '';
    fileNameDiv.textContent = ''; // Clear the file name display
});