import * as fs from "node:fs/promises";
import path from "node:path";

import configs, {AssetOptions} from "build:config.js";
import {promiseDebounce} from "build:debounce.js";
import chokidar from "chokidar";
import esbuild, {BuildOptions} from "esbuild";

const watch = process.argv[2] === "watch";

const buildOptions = configs(watch);

function isAssets(config: AssetOptions | BuildOptions): config is AssetOptions {
    return "type" in config && config.type === "assets";
}

async function processFile(config: AssetOptions, _filePath: string) {
    try {
        await fs.rm(config.outdir, {recursive: true});
    } catch (e) {
        /* noop */
    }
    await fs.cp(config.entryPoint, config.outdir, {recursive: true});
}

async function run() {
    if (watch) {
        const promises = [];
        for (const config of buildOptions) {
            if (isAssets(config)) {
                const path2 = path.join(config.entryPoint, "**", "*");
                await fs.mkdir(config.outdir, {recursive: true});
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
                const ctx = await esbuild.context({
                    ...config,
                    logLevel: "info",
                });
                promises.push(ctx.watch());
            }
        }
        await Promise.all(promises);
    } else {
        const promises = [];
        for (const config of buildOptions) {
            if (isAssets(config)) {
                try {
                    await fs.rm(config.outdir, {recursive: true});
                } catch (e) {
                    /* noop */
                }
                promises.push(fs.cp(config.entryPoint, config.outdir, {recursive: true}));
            } else {
                promises.push(esbuild.build(config));
            }
        }
        await Promise.all(promises);
    }
}

run().then(() => console.log("Build finished."));
