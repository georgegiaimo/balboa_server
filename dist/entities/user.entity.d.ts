export interface UserPersistenceData {
    id: string;
    email: string;
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface UserCreateData {
    email: string;
    password: string;
}
export declare class User {
    private readonly _id;
    private _email;
    private _password;
    private readonly _createdAt;
    private _updatedAt;
    private constructor();
    static create(data: UserCreateData): Promise<User>;
    static fromPersistence(data: UserPersistenceData): User;
    changeEmail(newEmail: string): Promise<void>;
    changePassword(newPassword: string): Promise<void>;
    verifyPassword(inputPassword: string): Promise<boolean>;
    private static validateEmail;
    private static validatePassword;
    private static hashPassword;
    private static generateId;
    get id(): string;
    get email(): string;
    get password(): string;
    get createdAt(): Date;
    get updatedAt(): Date;
    updateProfile(data: {
        email?: string;
        password?: string;
    }): Promise<void>;
    toPersistence(): UserPersistenceData;
    toResponse(): {
        id: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
    };
    equals(other: User): boolean;
}
