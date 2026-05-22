export declare enum HarnessCategoryEnum {
    CODING_AGENT = "CODING_AGENT",
    EVAL_HARNESS = "EVAL_HARNESS",
    RAG_FRAMEWORK = "RAG_FRAMEWORK",
    RESEARCH_AGENT = "RESEARCH_AGENT",
    TOOL_USE = "TOOL_USE",
    MULTI_AGENT = "MULTI_AGENT",
    BROWSER_AGENT = "BROWSER_AGENT",
    DATA_PIPELINE = "DATA_PIPELINE",
    OTHER = "OTHER"
}
export declare enum LicenseTierEnum {
    GREEN = "GREEN",
    YELLOW = "YELLOW",
    RED = "RED"
}
export declare enum HarnessSortEnum {
    STARS = "stars",
    DOWNLOADS = "downloads",
    RECENT = "recent",
    NAME = "name"
}
export declare class QueryHarnessesDto {
    category?: HarnessCategoryEnum;
    modelCompat?: string;
    languages?: string;
    licenseTier?: LicenseTierEnum;
    verified?: string;
    featured?: string;
    search?: string;
    sort?: HarnessSortEnum;
    page?: number;
    limit?: number;
}
