import configs, {AssetOptions} from "./config.js";
import esbuild, {BuildOptions} from "esbuild";
import * as fs from "node:fs/promises";
import chokidar from "chokidar";
import path from "node:path";
import {promiseDebounce} from "./debounce.js";

const watch = process.argv[2] === "watch";

const buildOptions = configs(watch);

function isAssets(config: AssetOptions | BuildOptions): config is AssetOptions {
    return "type" in config && config.type === "assets";
}

async function processFile(config: AssetOptions, filePath: string) {
    try {
        await fs.rm(config.outdir, {recursive: true});
    } catch (e) {}
    await fs.cp(config.entryPoint, config.outdir, {recursive: true});
}

async function run() {
    if (watch) {
        const promises = [];
        for (const config of buildOptions) {
            if (isAssets(config)) {
                const path2 = path.join(config.entryPoint, "**", "*");
                console.log(path2);
                const watcher = chokidar.watch(path2);

                const debounced = promiseDebounce(processFile, 1000);

                watcher.on("add", async (filePath) => {
                    debounced(config, filePath);
                });
                watcher.on("change", async (filePath) => {
                    debounced(config, filePath);
                });
                watcher.on("unlink", async (filePath) => {
                    debounced(config, filePath);
                });
            } else {
                const ctx = await esbuild.context(config);
                promises.push(ctx.watch());
            }
        }
        await Promise.all(promises);
    } else {
        const promises = [];
        for (const config of buildOptions) {
            if (isAssets(config)) {
                await fs.rm(config.outdir, {recursive: true});
                promises.push(fs.cp(config.entryPoint, config.outdir, {recursive: true}));
            } else {
                promises.push(esbuild.build(config));
            }
        }
        await Promise.all(promises);
    }
}

run().then(() => console.log("Process finished."));
