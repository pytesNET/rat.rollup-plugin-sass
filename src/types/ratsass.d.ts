
declare interface RatSassBasicConfig {
    /*
     |  EXCLUDE FILE FILTER
     |  @since          0.1.0
     |
     |  @values
     |      string      
     |      RegExp      
     |      Array       
     */
    exclude?: string | RegExp | Array<string | RegExp>;

    /*
     |  INCLUDE FILE FILTER
     |  @since          0.1.0
     |
     |  @values
     |      string      
     |      RegExp      
     |      Array       
     */
    include?: string | RegExp | Array<string | RegExp>;
}

declare interface RatSassOutputConfig extends RatSassBasicConfig {
    /*
     |  BANNER TO USE ON STYLESHEET
     |  @since          0.1.0
     |
     |  @values
     |      string      A banner text, which sould prepend the compiled stylesheet.
     */
    banner?: string | ((name: string) => string);

    /*
     |  OUTPUT STATEMENT
     |  @since          0.1.0
     |
     |  @values
     |      bool        TRUE to bundle all included stylesheet in one file, FALSE to store them separately.
     |      string      A name for the bundled stylesheet.
     */
    bundle?: boolean | string;

    /*
     |  FOOTER TO USE ON STYLESHEET
     |  @since          0.1.0
     |
     |  @values
     |      string      A footer text, which sould append the compiled stylesheet (but before the linked SourceMap).
     */
    footer?: string | ((name: string) => string);

    /*
     |  PREFIX SOME CONTENT
     |  @since          0.1.0
     |
     |  @values
     |      string      The SASS / SCSS / CSS content to prefix before compiling.
     |      function    A function returning the content to prefix before compiling.
     */
    prefix?: string | ((name: string) => string);

    /*
     |  PREPROCESs SOURCEMAP SOURCE URLs
     |  @since          0.1.0
     |
     |  @values
     |      string      A simple string pointing to the desires SASS directory (don't forget your sourceMapRoot value).
     |      boolean     TRUE tries to resolve all absolute paths to relative ones, FALSE will not touch the sourceMapUrls at all.
     |      Function    A function which receives the absolute path and should return the relative one.
     */
    sourceMapUrls?: boolean | string | ((url: string) => string);
}

declare interface RatSassPluginConfig extends RatSassOutputConfig, SassConfig {
    /*
     |  WATCHER
     |  @since          0.1.0
     |
     |  @values
     |      string      
     |      string[]    
     */
    watch?: string | string[];
}

declare interface RatSassRenderedChunk {
    css: string,
    map?: string
}

declare interface RatSassErrorHandler {
    error: string,
    position?: { column: number; line: number }
}
