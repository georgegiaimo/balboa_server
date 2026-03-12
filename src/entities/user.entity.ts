import { hash, compare } from 'bcryptjs';
import crypto from 'crypto';

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

export class User {
  private constructor(
    private readonly _id: string,
    private _email: string,
    private _password: string,
    private readonly _createdAt: Date = new Date(),
    private _updatedAt: Date = new Date(),
  ) {}

  static async create(data: UserCreateData): Promise<User> {
    const id = User.generateId();
    const validatedEmail = User.validateEmail(data.email);
    const hashedPassword = await User.hashPassword(data.password);

    return new User(id, validatedEmail, hashedPassword);
  }

  static fromPersistence(data: UserPersistenceData): User {
    return new User(
      data.id,
      data.email,
      data.password,
      data.createdAt || new Date(),
      data.updatedAt || new Date(),
    );
  }

  async changeEmail(newEmail: string): Promise<void> {
    const validatedEmail = User.validateEmail(newEmail);
    this._email = validatedEmail;
    this._updatedAt = new Date();
  }

  async changePassword(newPassword: string): Promise<void> {
    User.validatePassword(newPassword);
    const hashedPassword = await User.hashPassword(newPassword);
    this._password = hashedPassword;
    this._updatedAt = new Date();
  }

  async verifyPassword(inputPassword: string): Promise<boolean> {
    return compare(inputPassword, this._password);
  }

  private static validateEmail(email: string): string {
    if (!email || typeof email !== 'string') {
      throw new Error('Email is required');
    }

    const trimmedEmail = email.trim();

    if (trimmedEmail.length === 0) {
      throw new Error('Email cannot be empty');
    }

    if (trimmedEmail.length > 254) {
      throw new Error('Email is too long (max 254 characters)');
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(trimmedEmail)) {
      throw new Error('Invalid email format');
    }

    return trimmedEmail.toLowerCase();
  }

  private static validatePassword(password: string): void {
    if (!password || typeof password !== 'string') {
      throw new Error('Password is required');
    }

    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }

    if (password.length > 128) {
      throw new Error('Password is too long (max 128 characters)');
    }

    const hasNumber = /\d/.test(password);
    const hasLetter = /[a-zA-Z]/.test(password);

    if (!hasNumber || !hasLetter) {
      throw new Error('Password must contain at least one letter and one number');
    }
  }

  private static async hashPassword(password: string): Promise<string> {
    User.validatePassword(password);
    return hash(password, 12); 
  }

  private static generateId(): string {
    return crypto.randomUUID();
  }

  get id(): string {
    return this._id;
  }
  get email(): string {
    return this._email;
  }
  get password(): string {
    return this._password;
  }
  get createdAt(): Date {
    return new Date(this._createdAt);
  } 
  get updatedAt(): Date {
    return new Date(this._updatedAt);
  } 
  
  async updateProfile(data: { email?: string; password?: string }): Promise<void> {
    let hasChanges = false;

    if (data.email && data.email !== this._email) {
      await this.changeEmail(data.email);
      hasChanges = true;
    }

    if (data.password) {
      await this.changePassword(data.password);
      hasChanges = true;
    }

    if (hasChanges) {
      this._updatedAt = new Date();
    }
  }

  toPersistence(): UserPersistenceData {
    return {
      id: this._id,
      email: this._email,
      password: this._password,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }

  toResponse(): {
    id: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
  } {
    return {
      id: this._id,
      email: this._email,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }

  equals(other: User): boolean {
    return this._id === other._id;
  }
}
