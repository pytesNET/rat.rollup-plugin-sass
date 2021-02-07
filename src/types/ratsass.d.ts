
declare interface RatSASS_Config extends SASS_Config {
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

declare interface RatSASS_RenderedChunk {
    css: string,
    map?: string
}

declare interface RatSASS_ErrorObject {
    error: string,
    position?: { column: number; line: number }
}

