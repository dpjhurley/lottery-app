import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { SignUpRequest } from 'aws-sdk/clients/cognitoidentityserviceprovider';

const cognito = new CognitoIdentityServiceProvider();

interface CreateUserEvent {
    password: string;
    email: string;
    givenName: string;
    familyName: string;
};

export const handler = async (event: CreateUserEvent) => {
    const { password, email, givenName, familyName } = event;
    const params: SignUpRequest = {
        ClientId: process.env.USER_POOL_ID || '',
        Password: password,
        Username: email,
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
        return data;
    } catch (error) {
        console.error('Error signing up user: ', error);
        throw error;
    }
};
