import { z } from 'zod';

export interface CreateUserInput {
    email: string;
    password: string;
    givenName: string;
    familyName: string;
}

const CreateUserInput = z.object({
    email: z.string().email(),
    password: z
        .string()
        .min(8)
        .regex(
            /^(?=.*[0-9])(?=.*[!@#$%^&*/\\,><':;|_~`+=])(?=.*[A-Z])(?=.*[a-z]).*$/
        ),
    givenName: z.string().min(1),
    familyName: z.string().min(1),
});

export const createUserInputValidation = (input: CreateUserInput) => {
    const validatedInput = CreateUserInput.safeParse(input);

    if (!validatedInput.success) {
        throw new Error(`${validatedInput.error.issues.map((e) => e.message)}`);
    }
};

const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
    const { code, path } = issue;

    switch (code) {
        case z.ZodIssueCode.invalid_string:
            if (path[0] === 'password') {
                return {
                    message:
                        'password must contain 1 special character, 1 number, 1 lowercase and 1 uppercase letter',
                };
            }
            if (path[0] === 'email') {
                return { message: 'email must be a valid email' };
            }
        case z.ZodIssueCode.too_small:
            if (path[0] === 'password') {
                return { message: 'password must contain 8 characters' };
            }
            return { message: `${path[0]} must not be empty` };
        default:
            return { message: ctx.defaultError };
    }
};

z.setErrorMap(customErrorMap);
