import { IGoogleRepository } from '../repositories/google.repository';
export interface GoogleUser {
    id: string;
    primaryEmail: string;
    name: {
        fullName: string;
    };
    emails?: Array<{
        address: string;
        type: string;
        primary?: boolean;
    }>;
    aliases?: string[];
    orgUnitPath: string;
    creationTime: string;
    lastLoginTime: string;
}
export interface GoogleDirectoryResponse {
    users?: GoogleUser[];
    nextPageToken?: string;
}
export declare class GoogleService {
    private googleRepository;
    constructor(googleRepository: IGoogleRepository);
    getAccessToken(domain_keys: any, subject_email: string): Promise<any>;
    getUsersFromDirectory(access_token: string, pageToken: string): Promise<GoogleDirectoryResponse>;
    getOrganizationalUnits(access_token: string): Promise<GoogleDirectoryResponse>;
    syncProductions(): Promise<void>;
    syncUsers(): Promise<void>;
    addNewProductionAssignment(production: any, user: any): Promise<void>;
    getUsers(access_token: string): Promise<any[]>;
    deleteDuplicateAssignments(): Promise<void>;
    newReportAction(action: string, ids: any, params: any[]): Promise<void>;
    deleteGoogleUser(googleUserId: string, accessToken: string): Promise<void>;
    syncGoogleData(): Promise<void>;
    getLevenshteinDistance(a: string, b: string): number;
    getSimilarity(str1: string, str2: string, threshold?: number): number;
    temp(): Promise<void>;
}
