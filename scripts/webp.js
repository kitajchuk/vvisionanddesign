import sharp from "sharp";
import shell from "shelljs";

// Source images in local `data` directory -- ignored
const shellCmd = "find ./data -type f";
const shellOpts = { silent: true };

// The width for the `webp` versions
const imgMaxPortrait = 1440;
const imgMaxLandscape = 1920;

const imageBaseName = "vvisionbydesign";

// Viable local source image formats
const rImage = /\.(jpg|jpeg)$/;
const rFilename = /data\/(.*?)\.(jpg|jpeg)$/;

// Shell out to `find` for quick recurse
const files = shell
  .exec(shellCmd, shellOpts)
  .stdout.split("\n")
  .filter((f) => rImage.test(f));

// Process each file for Next's public directory
files.forEach(async (file, index) => {
  // This is the file we will write as `webp` version
  const fileName = file.match(rFilename)[1];
  const newFileName = `${imageBaseName}-${index}`;
  const pubFile = file.replace(
    `./data/${fileName}`,
    `public/images/${newFileName}`,
  );
  const outFile = pubFile.replace(rImage, ".webp");

  const metadata = await sharp(file).metadata();
  const isPortrait = metadata.width < metadata.height;
  const isSquare = metadata.width === metadata.height;
  const targetSize = isPortrait || isSquare ? imgMaxPortrait : imgMaxLandscape;
  const newWidth = metadata.width < targetSize ? metadata.width : targetSize;
  await sharp(file).resize(newWidth).toFile(outFile);
  console.log(
    `Making file: ${outFile} at ${newWidth}px ${isPortrait ? "portrait" : "landscape"}`,
  );
});
