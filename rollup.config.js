import clear from "rollup-plugin-clear";
import pkg from "./package.json";
export default [
  {
    input: "lib/index.js",
    plugins: [
      clear({ targets: ["dist"] }), //清除dist目录
    ],
    output: [
      {
        sourcemap: true,
        format: "umd",
        file: pkg["umd:main"],
        name: "boundaryJudgment",
      },
    ],
  },
  {
    input: "lib/index.js",
    plugins: [
      clear({ targets: ["dist"] }), //清除dist目录
    ],
    output: [
      {
        sourcemap: true,
        format: "commonjs",
        file: pkg.main,
      },
      {
        sourcemap: true,
        format: "esm",
        file: pkg.module,
      },
    ],
  },
];
