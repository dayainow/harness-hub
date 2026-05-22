import { HarnessCategoryEnum, LicenseTierEnum } from './query-harnesses.dto';
export declare class CreateHarnessDto {
    slug: string;
    name: string;
    orgName: string;
    repoUrl: string;
    description: string;
    readmeExcerpt?: string;
    stars?: number;
    forks?: number;
    issuesOpen?: number;
    latestVersion?: string;
    license?: string;
    licenseTier?: LicenseTierEnum;
    languages?: string[];
    category?: HarnessCategoryEnum;
    modelCompat?: string[];
    tags?: string[];
    verified?: boolean;
    featured?: boolean;
    installCmd?: string;
    downloadsCount?: number;
}
