import { createUserInputValidation } from '@lottery-app/core/validateInput';
import { APIGatewayProxyEventV2 } from 'aws-lambda';
import * as stepFunction from 'src/utils/stepFunction';
import * as cognito from '@lottery-app/core/cognito';

export const handler = async (event: APIGatewayProxyEventV2) => {
    if (!event.body || event.body === '') {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Missing request body' }),
        };
    }

    const parsedRequestBody = JSON.parse(event.body);

    try {
        createUserInputValidation(parsedRequestBody);
    } catch (error) {
        // TODO: Add better error handling
        if (error instanceof Error) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: error.message }),
            };
        }
    }

    try {
        if (!(await cognito.isUniqueEmail(parsedRequestBody.email))) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'User already exists' }),
            };
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Internal server error',
            }),
        };
    }

    if (!process.env.STATE_MACHINE) {
        console.error('No state machine found');
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Internal server error',
            }),
        };
    }

    try {
        const response = await stepFunction.trigger({
            input: event.body,
            sfArn: process.env.STATE_MACHINE,
        });

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Start machine started',
                executionId: response,
            }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Internal server error',
            }),
        };
    }
};
