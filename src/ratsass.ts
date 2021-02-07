
import { basename, dirname } from 'path';
import { OutputAsset, OutputBundle, OutputOptions, SourceDescription } from 'rollup';
import { createFilter } from 'rollup-pluginutils';

const sass = require('sass');


/*
 |  ROLLUP PLUGIN
 */
function RatSass(config: RatSassPluginConfig = { }) {
    const filter = createFilter(config.include || ['/**/*.css', '/**/*.scss', '/**/*.sass'], config.exclude);
    const includes = config.includePaths || ['node_modules'];
    includes.push(process.cwd());

    // Compile Function
    const compile = (styles: string, overwrite?: RatSassPluginConfig): RatSassRenderedChunk | RatSassErrorHandler => {
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
    const transform = function (code: string, id: string): SourceDescription {
        if (!filter(id)) {
            return;
        }
        includes.push(dirname(id));

        // Attach Watchers
        if ('watch' in config) {
            let files = Array.isArray(config.watch)? config.watch: [config.watch];
            files.forEach((file) => this.addWatchFile(file));
        }

        // Format Name
        let emitname = basename(id).split('.');
        emitname[emitname.length - 1] = 'css';

        // Handle Styles
        this.emitFile({
            type: 'asset',
            name: emitname.join('.'),
            source: code
        });
        return{
            code: '',
            map: { mappings: '' }
        };
    };

    // Generate Bundle Function
    const generateBundle = function (options: OutputOptions, bundle: OutputBundle, isWrite: boolean) {
        let source = '';

        // Trickle SourceMap Configuration
        if (typeof config.sourceMap === 'undefined') {
            config.sourceMap = options.sourcemap !== false && options.sourcemap !== 'hidden';
            if (options.sourcemap === 'inline') {
                config.sourceMapEmbed = true;
            }
            if (options.sourcemapExcludeSources) {
                config.sourceMapContents = true;
            }
        }

        // Loop Styles
        let keys = Object.keys(bundle);
        for (let name of keys) {
            if (name.lastIndexOf('.css') !== name.length - 4) {
                continue;
            }
            let file = bundle[name] as OutputAsset;

            // Compile SASS
            let data = compile(file.source as string, {
                outFile: name
            });
            if ('error' in data) {
                this.error(data.error, data.position);
                continue;
            }

            // Yay
            file.source = data.css;
            if (data.map && data.map.length > 0) {
                bundle[name + '.map'] = {
                    fileName: file.fileName + '.map',
                    name: file.name + '.map',
                    source: data.map,
                    type: 'asset',
                    isAsset: true   // @deprecated
                };
            }
        }
    };

    // Return Rollup Plugin
    return {
        name: "rat-sass",
        transform,
        generateBundle
    };
}

// Export Module
export default RatSass;
