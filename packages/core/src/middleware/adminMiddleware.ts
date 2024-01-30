import middy from '@middy/core';
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';

export const isAdminMiddleware = (): middy.MiddlewareObj<
    APIGatewayProxyEventV2,
    APIGatewayProxyResultV2
> => {
    const isAdminMiddlewareBefore: middy.MiddlewareFn<
        APIGatewayProxyEventV2,
        APIGatewayProxyResultV2
    > = async (request) => {    
        console.log("TODO: Need to check for admin", request);
        // need to do something to check if admin
        
        // Check if the user is an admin
        // if (!userAttributes || !userAttributes['is_admin']) {
        //   throw new Error('Unauthorized');
        // }    
    };

    return { before: isAdminMiddlewareBefore };
};
