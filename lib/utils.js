import fs from "fs";
import path from "path";
import { imageSizeFromFile } from "image-size/fromFile";

function readDirectory(dir) {
  return fs
    .readdirSync(dir)
    .filter((file) => {
      return !/^\./.test(file);
    })
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

export async function readPublicImageDirectory() {
  const fullPath = path.join(process.cwd(), "public/images");

  return await Promise.all(
    readDirectory(fullPath).map(async (img) => {
      console.log(img);
      const imgPath = path.join(fullPath, img);
      const imgSrc = `/images/${img}`;
      const imgDims = await imageSizeFromFile(imgPath);
      const imgOrientation =
        imgDims.height > imgDims.width ? "portrait" : "landscape";

      return {
        orientation: imgOrientation,
        aspect: (imgDims.height / imgDims.width) * 100,
        width: imgDims.width,
        height: imgDims.height,
        src: imgSrc,
        uid: img,
        alt: "",
      };
    }),
  );
}
