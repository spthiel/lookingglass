import path from "path";
import {BuildOptions} from "esbuild";

const outFolder = path.resolve("dist");

export interface AssetOptions {
    type: "assets";
    entryPoint: string;
    outdir: string;
}

export default function configs(watch: boolean): (BuildOptions | AssetOptions)[] {
    return [
        {
            entryPoints: [path.resolve("src", "electron", "main.ts")],
            outfile: path.resolve(outFolder, "window", "main.cjs"),
            bundle: true,
            platform: "node",
            minify: !watch,
            external: ["electron"],
        },
        {
            entryPoints: [path.resolve("src", "electron", "preload.ts")],
            outfile: path.resolve(outFolder, "window", "preload.cjs"),
            bundle: true,
            platform: "node",
            minify: !watch,
            external: ["electron"],
        },
        {
            entryPoints: [path.resolve("src", "page", "main.ts")],
            outfile: path.resolve(outFolder, "page", "main.js"),
            bundle: true,
            platform: "browser",
            minify: !watch,
        },
        {
            type: "assets",
            entryPoint: path.resolve("src", "page", "assets"),
            outdir: path.resolve(outFolder, "page", "assets"),
        },
        {
            entryPoints: [path.resolve("src", "teams-userscript", "main.ts")],
            outfile: path.resolve(outFolder, "teams-userscript", "main.js"),
            bundle: true,
            platform: "browser",
            minify: !watch,
        },
    ];
}
