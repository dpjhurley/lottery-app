import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { SignUpRequest } from 'aws-sdk/clients/cognitoidentityserviceprovider';
import { ApiHandler } from 'sst/node/api';

const cognito = new CognitoIdentityServiceProvider();

interface CreateUserEvent {
    email: string;
    password: string;
    givenName: string;
    familyName: string;
}

export const createUser = async (event: CreateUserEvent) => {
    console.log('HERE');
    const { email, password, givenName, familyName } = event;

    // Validate input
    if (!email || !password || !givenName || !familyName) {
        throw new Error('Missing required fields');
    }

    const params: SignUpRequest = {
        ClientId: process.env.USER_POOL_CLIENT_ID || '',
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
        ],
    };

    try {
        const data = await cognito.signUp(params).promise();
        console.log('User signed up successfully: ', data);

        return {
            Payload: {
                email,
            },
        };
    } catch (error) {
        console.error('Error signing up user: ', error);
        throw error;
    }
};

export const getUser = ApiHandler(async (_evt) => {
    // Your getUser logic here
    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'getUser successful' }),
    };
});

export const getUsers = ApiHandler(async (_evt) => {
    // Your getUsers logic here
    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'getUsers successful' }),
    };
});

export const updateUser = ApiHandler(async (_evt) => {
    // Your updateUser logic here
    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'updateUser successful' }),
    };
});

export const deleteUser = ApiHandler(async (_evt) => {
    // Your deleteUser logic here
    return {
        statusCode: 204,
        body: JSON.stringify({ message: 'deleteUser successful' }),
    };
});
