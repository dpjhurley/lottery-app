import { ApiHandler } from 'sst/node/api';

export const isWinner = ApiHandler(async (_evt) => {
    // Your isWinner logic here
    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'isWinner successful' }),
    };
});