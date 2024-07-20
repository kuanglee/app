// watcher.js
const chokidar = require('chokidar');

const directoryToWatch = '/Users/nals_macbook_315/Projects/Project_dental/gcp-admin';
// Initialize the watcher
const watcher = chokidar.watch(directoryToWatch, {
    ignored: /node_modules/,
    persistent: true
});

// Add event listeners
watcher
    .on('add', path => console.log(`File ${path} has been added`))
    .on('change', path => console.log(`File ${path} has been changed`))
    .on('unlink', path => console.log(`File ${path} has been removed`));

console.log('Watching for file changes...');