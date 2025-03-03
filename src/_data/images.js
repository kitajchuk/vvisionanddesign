import { readPublicImageDirectory } from "../../lib/utils.js";

export default async function () {
  const images = await readPublicImageDirectory();
  return images;
}
