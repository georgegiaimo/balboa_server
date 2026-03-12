/**
 * @deprecated Use User entity class from @entities/user.entity instead
 * This interface is kept for backward compatibility only
 */
export interface User {
    id?: string | number;
    email: string;
    password: string;
}
