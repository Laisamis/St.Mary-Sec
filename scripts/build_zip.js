import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

const zip = new JSZip();
const rootDir = 'st_marys_secondary_school';
const zipFolder = zip.folder(rootDir);

const vanillaDir = path.resolve('public/vanilla-version');

// Copy all files from public/vanilla-version into the zip
function addFolderToZip(folderPath, zipTarget) {
  const items = fs.readdirSync(folderPath);
  for (const item of items) {
    const fullPath = path.join(folderPath, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      const subZip = zipTarget.folder(item);
      addFolderToZip(fullPath, subZip);
    } else {
      const content = fs.readFileSync(fullPath);
      zipTarget.file(item, content);
    }
  }
}

addFolderToZip(vanillaDir, zipFolder);

// Output to public/downloads/st_marys_school_project.zip
const downloadsDir = path.resolve('public/downloads');
if (!fs.existsSync(downloadsDir)) {
  fs.mkdirSync(downloadsDir, { recursive: true });
}

zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE', compressionOptions: { level: 9 } })
  .then((buffer) => {
    const outputPath = path.join(downloadsDir, 'st_marys_school_project.zip');
    fs.writeFileSync(outputPath, buffer);
    console.log('ZIP package rebuilt successfully at: ' + outputPath + ' (' + buffer.length + ' bytes)');
  })
  .catch((err) => {
    console.error('Error creating ZIP package:', err);
    process.exit(1);
  });
