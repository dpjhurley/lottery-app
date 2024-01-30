import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { cognito } from '@lottery-app/core/service';
import middy from '@middy/core';
import { validationMiddleware } from '@lottery-app/core/middleware';
import { CodeMismatchException } from '@aws-sdk/client-cognito-identity-provider';

type ParsedAPIGatewayProxyEventV2 = Omit<APIGatewayProxyEventV2, 'body'> & {
    body: {
        username: string;
        confirmationCode: string;
    };
};

const confirmHandler = async (event: ParsedAPIGatewayProxyEventV2) => {
    const { body } = event;

    try {
        await cognito.confirmUser(body);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Confirmation successful' }),
        };
    } catch (error) {
        console.error('Error confirming user: ', error);
        if (error instanceof CodeMismatchException) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: error.message }),
            };
        }

        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Internal server error',
            }),
        };
    }
};

export const handler = middy(confirmHandler)
    .use(validationMiddleware.validateNonEmptyUnparsedBodyMiddleware())
    .use(validationMiddleware.validateAuthConfirmMiddleware());
