import middy from '@middy/core';
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { jwtDecode } from 'jwt-decode';

interface LotteryUserToken {
    "email": string;
    "family_name": string;
    "given_name": string;
    'custom:isAdmin': string;
}

export const isAdminMiddleware = (): middy.MiddlewareObj<
    APIGatewayProxyEventV2,
    APIGatewayProxyResultV2
> => {
    const isAdminMiddlewareBefore: middy.MiddlewareFn<
        APIGatewayProxyEventV2,
        APIGatewayProxyResultV2
    > = async (request) => {
        // need to do something to check if admin
        console.log({ HERE: request });
        console.log({ token: request.event.headers });

        const { authorization } = request.event.headers;
        if (!authorization) {
            throw new Error('Unauthorized');
        }

        const token = authorization.split(' ')[1];
        const decoded = jwtDecode<LotteryUserToken>(token);

        const adminAttribute = decoded['custom:isAdmin'];

        // Check if the user is an admin
        if (adminAttribute !== 'true') {
            throw new Error('Unauthorized');
        }
    };

    return { before: isAdminMiddlewareBefore };
};
