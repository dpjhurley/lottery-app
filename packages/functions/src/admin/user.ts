// import { CreateUserInput } from '@lottery-app/core/validateInput';
// import { cognito } from '@lottery-app/core/service';
import { ApiHandler } from 'sst/node/api';


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
