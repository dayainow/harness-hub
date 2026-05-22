import { HarnessCategoryEnum } from './query-harnesses.dto';
export declare class SubmitHarnessDto {
    repoUrl: string;
    category?: HarnessCategoryEnum;
    installCmd?: string;
    modelCompat?: string[];
    name?: string;
    orgName?: string;
    description?: string;
    license?: string;
    languages?: string[];
    tags?: string[];
    stars?: number;
}
