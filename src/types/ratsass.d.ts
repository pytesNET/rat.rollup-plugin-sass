
declare interface RatSassBasicConfig {
    /*
     |  EXCLUDE FILE FILTER
     |  @since          0.1.0
     |
     |  @values
     |      string      
     |      RegExp      
     |      Array       
     |
     |  @default
     |      [ ]
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
     |
     |  @default
     |      [ ... ]
     */
    include?: string | RegExp | Array<string | RegExp>;
}

declare interface RatSassOutputConfig extends RatSassBasicConfig {
    /*
     |  BANNER TO USE ON STYLESHEET
     |  @since          0.1.0
     |
     |  @values
     |      string      The banner text, which sould prepend the compiled stylesheet.
     |
     |  @default
     |      ""
     */
    banner?: string;

    /*
     |  OUTPUT STATEMENT
     |  @since          0.1.0
     |
     |  @values
     |      bool        TRUE to bundle all included stylesheet in one file, FALSE to store them separately.
     |
     |  @default
     |      [ ]
     */
    bundle?: boolean;

    /*
     |  OUTPUT STATEMENT
     |  @since          0.1.0
     |
     |  @values
     |      boolean     TRUE to use default output, FALSE to disable output.
     |      string      
     |      Object
     |      Function    
     |
     |  @default
     |      [ ]
     */
    output?: boolean | string | Function;
}

declare interface RatSassPluginConfig extends RatSassOutputConfig, SassConfig {
    /*
     |  WATCHER
     |  @since          0.1.0
     |
     |  @values
     |      string      
     |      string[]    
     |
     |  @default
     |      [ ]
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
