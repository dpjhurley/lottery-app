import { CreateUserInput } from '@lottery-app/core/types/types';
import { cognito } from '@lottery-app/core/service';

export const handler = async (event: CreateUserInput) => {
    const { email, password, givenName, familyName } = event;

    try {
        const data = await cognito.createUser({
            email,
            password,
            givenName,
            familyName,
        });
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
