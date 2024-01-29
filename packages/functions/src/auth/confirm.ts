import { APIGatewayProxyEventV2 } from 'aws-lambda';
import * as cognito from '@lottery-app/core/cognito';

export const handler = async (event: APIGatewayProxyEventV2) => {
    if (!event.body || event.body === '') {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Missing request body' }),
        };
    }

    const parsedRequestBody = JSON.parse(event.body);
    if (!parsedRequestBody.username || !parsedRequestBody.confirmationCode) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Missing required fields' }),
        };
    }

    try {
        await cognito.confirmUser(parsedRequestBody);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Confirmation successful' }),
        };
    } catch (error) {
        console.error('Error confirming user: ', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Internal server error',
            }),
        };
    }
};
