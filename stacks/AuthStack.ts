import { BooleanAttribute } from 'aws-cdk-lib/aws-cognito';
import { ApiStack } from './ApiStack';
import { Cognito, StackContext, use } from 'sst/constructs';

export const AuthStack = ({ stack, app }: StackContext) => {
    const { api } = use(ApiStack);

    // Create a Cognito User Pool and Identity Pool
    const auth = new Cognito(stack, 'LotteryUsers-bar', {
        login: ['email'],
        cdk: {
            userPool: {
                standardAttributes: {
                    email: {
                        required: true,
                        mutable: false,
                    },
                    familyName: {
                        required: false,
                        mutable: true,
                    },
                    givenName: {
                        required: false,
                        mutable: true,
                    },
                },
                customAttributes: {
                    isAdmin: new BooleanAttribute({ mutable: true }),
                },
                passwordPolicy: {
                    minLength: 8,
                    requireLowercase: true,
                    requireUppercase: true,
                    requireDigits: true,
                    requireSymbols: true,
                },
            },
            userPoolClient: {},
        },
    });

    auth.attachPermissionsForAuthUsers(stack, [
        // Allow access to the API
        api,
    ]);

    // Show the auth resources in the output
    stack.addOutputs({
        Region: app.region,
        UserPoolId: auth.userPoolId,
        UserPoolClientId: auth.userPoolClientId,
        IdentityPoolId: auth.cognitoIdentityPoolId,
    });

    api.addRoutes(stack, {
        'POST /auth/confirm': {
            function: {
                handler: 'packages/functions/src/auth/confirm.handler',
                environment: {
                    USER_POOL_CLIENT_ID: auth.userPoolClientId,
                },
            },
        },
    });

    return {
        auth,
    };
};
