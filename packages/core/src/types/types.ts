export interface CreateUserInput {
    email: string;
    password: string;
    givenName: string;
    familyName: string;
}

interface EmailInput {
    email: string;
    username: string;
}

export interface EmailEvent {
    detail: EmailInput;
}

export interface ConfirmUserInput {
    username: string;
    confirmationCode: string;
}
