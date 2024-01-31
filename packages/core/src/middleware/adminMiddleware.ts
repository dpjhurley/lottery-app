import middy from '@middy/core';
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { jwtDecode } from 'jwt-decode';

interface LotteryUserToken {
    email: string;
    family_name: string;
    given_name: string;
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
        const { authorization } = request.event.headers;
        if (!authorization) {
            return {
                statusCode: 401,
                body: JSON.stringify({
                    message: 'Unauthorized',
                }),
            };
        }

        const token = authorization.split(' ')[1];
        try {
            const decoded = await jwtDecode<LotteryUserToken>(token);
            console.log('decoded', decoded);

            const adminAttribute = decoded['custom:isAdmin'];

            // Check if the user is an admin
            if (adminAttribute !== 'true') {
                return {
                    statusCode: 401,
                    body: JSON.stringify({
                        message: 'Unauthorized',
                    }),
                };
            }
        } catch (error) {
            return {
                statusCode: 401,
                body: JSON.stringify({
                    message: 'Unauthorized',
                }),
            };
        }
    };

    return { before: isAdminMiddlewareBefore };
};
