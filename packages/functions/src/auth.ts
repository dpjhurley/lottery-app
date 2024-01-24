import { ApiHandler } from 'sst/node/api';

export const signup = ApiHandler(async (_evt) => {
    // Your signup logic here
    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Signup successful' }),
    };
});

export const confirm = ApiHandler(async (_evt) => {
    // Your confirm logic here
    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Confirmation successful' }),
    };
});
