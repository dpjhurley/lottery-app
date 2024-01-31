import { ConfirmUserInput, CreateUserInput } from '../types/types';
import {
    CognitoIdentityProviderClient,
    SignUpCommand,
    AdminGetUserCommand,
    CognitoIdentityProviderClientConfig,
    ConfirmSignUpCommand,
    ListUsersCommand,
    UserStatusType,
} from '@aws-sdk/client-cognito-identity-provider';



// config could be region, credentials, etc
const createCognitoClient = (config: CognitoIdentityProviderClientConfig) => {
    return new CognitoIdentityProviderClient(config);
};

export const createUser = async (event: CreateUserInput) => {
    if (!process.env.USER_POOL_CLIENT_ID) {
        throw new Error('No user pool found');
    }
    const cognitoClient = createCognitoClient({});
    const { email, password, givenName, familyName } = event;

    const command = new SignUpCommand({
        ClientId: process.env.USER_POOL_CLIENT_ID,
        Username: email,
        Password: password,
        UserAttributes: [
            {
                Name: 'given_name',
                Value: givenName,
            },
            {
                Name: 'family_name',
                Value: familyName,
            },
            {
                Name: 'custom:isAdmin',
                Value: "false"
            },
        ],
    });

    try {
        return await cognitoClient.send(command);
    } catch (error) {
        console.error('Error signing up user: ', error);
        throw error;
    }
};

export const isUniqueEmail = async (email: string) => {
    if (!process.env.USER_POOL_ID) {
        throw new Error('No user pool found');
    }
    const cognitoClient = createCognitoClient({});

    const command = new AdminGetUserCommand({
        UserPoolId: process.env.USER_POOL_ID,
        Username: email,
    });

    try {
        await cognitoClient.send(command);
        return false;
    } catch (error) {
        console.log(`User with email: ${email} does not exists`);
        return true;
    }
};

export const confirmUser = async ({
    username,
    confirmationCode,
}: ConfirmUserInput) => {
    if (!process.env.USER_POOL_CLIENT_ID) {
        throw new Error('No user pool found');
    }
    const cognitoClient = createCognitoClient({});

    const command = new ConfirmSignUpCommand({
        ClientId: process.env.USER_POOL_CLIENT_ID,
        Username: username,
        ConfirmationCode: confirmationCode,
    });

    try {
        await cognitoClient.send(command);
    } catch (error) {
        console.error(`Error confirming user with username: ${username}`);
        throw error;
    }
};

export const listConfirmedUsers = async () => {
    if (!process.env.USER_POOL_ID) {
        throw new Error('No user pool found');
    }
    const cognitoClient = createCognitoClient({});

    const command = new ListUsersCommand({
        UserPoolId: process.env.USER_POOL_ID,
    });

    try {
        const response = await cognitoClient.send(command);
        const confirmedUsers = response.Users?.filter(
            (user) => user.UserStatus === UserStatusType.CONFIRMED
        ) || [];
        return confirmedUsers;
    } catch (error) {
        console.error('Error getting all users');
        throw error;
    }
};
