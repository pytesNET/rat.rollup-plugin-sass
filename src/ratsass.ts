
import { basename, dirname } from 'path';
import { EmittedAsset, OutputBundle, OutputOptions, SourceDescription } from 'rollup';
import { createFilter } from 'rollup-pluginutils';
import RatSassOutput from './ratsass-output';


/*
 |  ROLLUP PLUGIN
 */
function RatSass(config: RatSassPluginConfig = { }) {
    const filter = createFilter(config.include || ['/**/*.css', '/**/*.scss', '/**/*.sass'], config.exclude);
    const chunks = { length: 0, reference: undefined };
    const includes = config.includePaths || ['node_modules'];
    includes.push(process.cwd());

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

        // Handle FileNameHandler
        if (typeof config.fileNames !== 'undefined') {
            let emitname = basename(id).split('.');
            emitname.pop();

            var emitdata: EmittedAsset = {
                type: 'asset',
                fileName: config.fileNames.replace(/\[name\]/g, emitname.join('.')).replace(/\[extname\]/g, '.css') + ':css',
                source: code
            };
        } else {
            let emitname = basename(id).split('.');
            emitname[emitname.length - 1] = 'css';

            var emitdata: EmittedAsset = {
                type: 'asset',
                name: emitname.join('.'),
                source: code
            };
        }

        // Handle Styles
        if (!config.bundle) {
            this.emitFile(emitdata);
        } else {
            if (typeof chunks.reference === 'undefined') {
                chunks.reference = this.emitFile(emitdata);
            }
            chunks[chunks.length++] = code;
        }
        return {
            code: '',
            map: { mappings: '' }
        };
    };

    // Generate Bundle Function
    const generateBundle = function (options: OutputOptions, bundle: OutputBundle, isWrite: boolean) {
        let skipOutput = false;
        for (let plugin in options.plugins) {
            if (options.plugins[plugin].name === 'rat-sass-output') {
                skipOutput = true;
                break;
            }
        }

        // Handle Bundled Output
        //if (!!config.bundle) {
        //    for (let i = 0; i < chunks.length; i++) {
        //        file.source += chunks[i];
        //    }
        //}

        // Justify FileName
        //file.fileName = file.fileName.substr(0, file.fileName.length - 4);
        //if (config.outputStyle === 'compressed' && config.fileNames.indexOf('[extname]') >= 0) {
        //    file.fileName = file.fileName.replace('.css', '.min.css');
        //}

        // Generate Bundle
        if (!skipOutput) {
            RatSassOutput(config).generateBundle(options, bundle, isWrite)
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
