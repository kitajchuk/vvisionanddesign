import sharp from "sharp";
import shell from "shelljs";

// Source images in local `data` directory -- ignored
const shellOpts = { silent: true };

// The width for the `webp` versions
const imgMaxPortrait = 1440;
const imgMaxLandscape = 1920;

const imageBaseName = "vvisionbydesign";

// Viable local source image formats
const rImage = /\.(jpg|jpeg|nef|png)$/;
const rFilename = /data\/(.*?)\.(jpg|jpeg|nef|png)$/;

// List all files in data directory and process each file to remove spaces
shell.ls("./data").forEach((file) => {
  if (file.includes(" ")) {
    const oldPath = `./data/${file}`;
    const newPath = `./data/${file.replace(/\s+/g, "")}`;
    shell.mv(oldPath, newPath);
    console.log(`Renamed: ${oldPath} -> ${newPath}`);
  }
});

// List all files with newest first and filter for images
const files = shell
  .exec("ls -lt ./data", shellOpts)
  .stdout.split("\n")
  .map((f) => {
    const parts = f.trim().split(" ");
    return parts[parts.length - 1].trim();
  })
  .filter((f) => rImage.test(f));

// Process each file for the web public directory
files.forEach(async (file, index) => {
  // This is the file we will write as `webp` version
  const filePath = `./data/${file}`;
  const fileName = filePath.match(rFilename)[1];
  const newFileName = `${imageBaseName}-${index}`;
  const pubFile = filePath.replace(
    `./data/${fileName}`,
    `public/images/${newFileName}`,
  );
  const outFile = pubFile.replace(rImage, ".webp");

  const metadata = await sharp(filePath).metadata();
  const isPortrait = metadata.width < metadata.height;
  const isSquare = metadata.width === metadata.height;
  const targetSize = isPortrait || isSquare ? imgMaxPortrait : imgMaxLandscape;
  const newWidth = metadata.width < targetSize ? metadata.width : targetSize;
  await sharp(filePath).resize(newWidth).toFile(outFile);
  console.log(
    `Making file: ${outFile} at ${newWidth}px ${isPortrait ? "portrait" : "landscape"}`,
  );
});
