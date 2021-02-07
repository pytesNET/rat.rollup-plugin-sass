
import { OutputOptions, SourceDescription } from 'rollup';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { basename, dirname } from 'path';
import { createFilter } from 'rollup-pluginutils';

const sass = require('sass');

/*
 |  ROLLUP PLUGIN
 */
function RatSass(config: RatSASS_Config = { }) {
    const filter = createFilter(config.include || ['/**/*.css', '/**/*.scss', '/**/*.sass'], config.exclude);
    const chunks = { };
    const includes = config.includePaths || ['node_modules'];
    includes.push(process.cwd());

    // Compile Function
    const compile = (styles: string, overwrite?: RatSASS_Config): RatSASS_RenderedChunk | RatSASS_ErrorObject => {
        try {
            let data = sass.renderSync(Object.assign({
                data: styles,
                includePaths: includes
            }, config, overwrite));

            return {
                css: data.css.toString(),
                map: (data.map || "").toString()
            };
        } catch (e) {
            if (e.line && e.column) {
                return {
                    error: e.message,
                    position: {
                        line: e.line,
                        column: e.column
                    }
                };
            } else {
                return { error: e.message };
            }
        }
    };

    // Transform Function
    const transform = (code: string, id: string): SourceDescription => {
        if (!filter(id)) {
            return;
        }
        includes.push(dirname(id));

        // Attach Watchers
        if ('watch' in config) {
            let files = Array.isArray(config.watch)? config.watch: [config.watch];
            files.forEach((file) => this.addWatchFile(file));
        }

        // Disable Output
        if (!config.output) {
            return {
                code: '',
                map: { mappings: '' }
            }
        }

        // Handle Styles
        chunks[id] = code;
        return {
            code: '',
            map: { mappings: '' }
        };
    };

    // Generate Bundle Function
    const generateBundle = (options: OutputOptions) => {
        if (config.output === false) {
            return;
        }

        // 
        if (config.output === true) {
            
        }

        // 
        if (typeof config.output === 'string') {

        }

        // 
        if (typeof config.output === 'function') {

        }
    };

    // Return Rollup Plugin
    return {
        name: "rat-sass",
        transform,
        generateBundle
    };



    /*
     |  GENERATE BUNDLE
     *
    const _generateBundle = (opts) => {
        if(options.output === false) {
            return;
        }
        if(typeof options.output === "object") {
            for(let outputStyle in options.output) {
                let dest = options.output[outputStyle];

                for(let path in styles) {
                    let name = basename(path, path.indexOf(".scss") >= 0? ".scss": ".sass");
                    let store = dest.replace("[name]", name);
                    let overwrite = { outputStyle: outputStyle };

                    // Handle SourceMap
                    if("sourceMap" in options) {
                        if(options.sourceMap === true) {
                            overwrite.sourceMap = store.slice(store.lastIndexOf("/")+1) + ".map";
                        } else if(typeof options.sourceMap === "string") {
                            overwrite.sourceMap = options.sourceMap.replace("[name]", name);
                        }
                    }

                    // Render
                    let data = compile(styles[path], overwrite);
                    if(!("css" in data) || data.css.length <= 0) {
                        continue;
                    }

                    // Check if Directory exists
                    ensureParentDirsSync(dirname(store))

                    // Write CSS File
                    let banner = options.banner? options.banner[outputStyle] || "": "";
                    banner = banner.replace("[name]", name);

                    writeFileSync(store, banner + "\n" + data.css);
                    if("map" in data && data.map.length >= 0) {
                        writeFileSync(store + ".map", data.map);
                        console.log(`\x1b[32mcreated \x1b[32m\x1b[1m${store}, ${store}.map ${getSize(data.css.length)}\x1b[0m`);
                    } else {
                        console.log(`\x1b[32mcreated \x1b[32m\x1b[1m${store} ${getSize(data.css.length)}\x1b[0m`);
                    }
                }
            }
        }
    }
    */
}

// Export Module
export default RatSass;
