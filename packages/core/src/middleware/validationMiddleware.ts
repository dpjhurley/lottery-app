import middy from '@middy/core';
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { z } from 'zod';

export const validateNonEmptyUnparsedBodyMiddleware = (): middy.MiddlewareObj<
    APIGatewayProxyEventV2,
    APIGatewayProxyResultV2
> => {
    const validateNonEmptyBodyMiddlewareBefore: middy.MiddlewareFn<
        APIGatewayProxyEventV2,
        APIGatewayProxyResultV2
    > = async (request) => {
        const { event } = request;
        if (!event.body || event.body === '') {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Missing request body' }),
            };
        }

        request.event.body = JSON.parse(event.body);
    };

    return { before: validateNonEmptyBodyMiddlewareBefore };
};

export const validateCreateUserMiddleware = (): middy.MiddlewareObj<
    APIGatewayProxyEventV2,
    APIGatewayProxyResultV2
> => {
    const validateCreateUserMiddlewareBefore: middy.MiddlewareFn<
        APIGatewayProxyEventV2,
        APIGatewayProxyResultV2
    > = async (request) => {
        const CreateUserInput = z.object({
            email: z.string({
                errorMap: (issue, ctx) => {
                    switch (issue.code) {
                        case z.ZodIssueCode.invalid_type:
                            return {
                                message: 'email is required and must be a string',
                            };
                        default:
                            return { message: ctx.defaultError };
                    }
                },
            }).email(),
            password: z
                .string({
                    errorMap: (issue, ctx) => {
                        switch (issue.code) {
                            case z.ZodIssueCode.invalid_string:
                                return {
                                    message:
                                        'password must contain 1 special character, 1 number, 1 lowercase and 1 uppercase letter',
                                };
                            case z.ZodIssueCode.invalid_type:
                                return {
                                    message: 'password is required and must be a string',
                                };
                            default:
                                return { message: ctx.defaultError };
                        }
                    },
                })
                .min(8)
                .regex(
                    /^(?=.*[0-9])(?=.*[!@#$%^&*/\\,><':;|_~`+=])(?=.*[A-Z])(?=.*[a-z]).*$/
                ),
            givenName: z.string({
                errorMap: (issue, ctx) => {
                    switch (issue.code) {
                        case z.ZodIssueCode.invalid_type:
                            return {
                                message: 'given name is required and must be a string',
                            };
                        default:
                            return { message: ctx.defaultError };
                    }
                },
            }).min(1),
            familyName: z.string({
                errorMap: (issue, ctx) => {
                    switch (issue.code) {
                        case z.ZodIssueCode.invalid_type:
                            return {
                                message: 'family name is required and must be a string',
                            };
                        default:
                            return { message: ctx.defaultError };
                    }
                },
            }).min(1),
        });

        const validatedInput = CreateUserInput.safeParse(request.event.body);

        if (!validatedInput.success) {
            return {
                statusCode: 400,
                body: JSON.stringify([
                    validatedInput.error.issues.map((e) => e.message),
                ]),
            };
        }
    };

    return { before: validateCreateUserMiddlewareBefore };
};

export const validateAuthConfirmMiddleware = (): middy.MiddlewareObj<
    APIGatewayProxyEventV2,
    APIGatewayProxyResultV2
> => {
    const validateAuthConfirmMiddlewareBefore: middy.MiddlewareFn<
        APIGatewayProxyEventV2,
        APIGatewayProxyResultV2
    > = async (request) => {
        const AuthConfirmInput = z.object({
            username: z.string({
                errorMap: (issue, ctx) => {
                    switch (issue.code) {
                        case z.ZodIssueCode.invalid_type:
                            return {
                                message: 'username is required and must be a string',
                            };
                        default:
                            return { message: ctx.defaultError };
                    }
                },
            }).min(1),
            confirmationCode: z.string({
                errorMap: (issue, ctx) => {
                    switch (issue.code) {
                        case z.ZodIssueCode.invalid_type:
                            return {
                                message: 'confirmationCode is required and must be a string',
                            };
                        default:
                            return { message: ctx.defaultError };
                    }
                },
            }).min(6).max(6),
        });

        const validatedInput = AuthConfirmInput.safeParse(request.event.body);

        if (!validatedInput.success) {
            return {
                statusCode: 400,
                body: JSON.stringify([
                    validatedInput.error.issues.map((e) => e.message),
                ]),
            };
        }
    };

    return { before: validateAuthConfirmMiddlewareBefore };
};

export const validateLotteryWinnerMiddleware = (): middy.MiddlewareObj<
    APIGatewayProxyEventV2,
    APIGatewayProxyResultV2
> => {
    const validateLotteryWinnerMiddlewareBefore: middy.MiddlewareFn<
        APIGatewayProxyEventV2,
        APIGatewayProxyResultV2
    > = async (request) => {
        const LotteryWinnerInput = z.object({
            username: z.string({
                errorMap: (issue, ctx) => {
                    switch (issue.code) {
                        case z.ZodIssueCode.invalid_type:
                            return {
                                message: 'username is required and must be a string',
                            };
                        default:
                            return { message: ctx.defaultError };
                    }
                },
            }).min(1),
        });

        const validatedInput = LotteryWinnerInput.safeParse(request.event.body);

        if (!validatedInput.success) {
            return {
                statusCode: 400,
                body: JSON.stringify([
                    validatedInput.error.issues.map((e) => e.message),
                ]),
            };
        }
    };

    return { before: validateLotteryWinnerMiddlewareBefore };
};