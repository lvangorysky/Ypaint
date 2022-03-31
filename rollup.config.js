/*
 * @Author: yhh
 * @LastEditors: yhh
 */
import typescript from "rollup-plugin-typescript";
import sourceMaps from "rollup-plugin-sourcemaps";
import babel from "rollup-plugin-babel";

export default {
    input: "./src/index.ts",
    plugins: [
        typescript({
            exclude: "node_modules/**",
            typescript: require("typescript"),
        }),
        sourceMaps(),
    ],
    output: [
        {
            format: "es",
            file: "lib/bundle.esm.js",
            sourcemap: true,
        },
    ],
    plugins: [
        babel({
          extensions: [".js", ".ts"],
          exclude: "node_modules/**"
        })
    ],
};
