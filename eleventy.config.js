import tailwindcss from "@tailwindcss/vite";
import EleventyVitePlugin from "@11ty/eleventy-plugin-vite";

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ public: "." });
  eleventyConfig.addPassthroughCopy({ "src/css": "css" });

  eleventyConfig.addPlugin(EleventyVitePlugin, {
    viteOptions: {
      plugins: [tailwindcss()],
    },
  });

  eleventyConfig.setLiquidOptions({
    // https://www.11ty.dev/docs/languages/liquid/#java-script-truthiness-in-liquid
    jsTruthy: true,
  });

  return {
    dir: {
      input: "src",
    },
  };
}
