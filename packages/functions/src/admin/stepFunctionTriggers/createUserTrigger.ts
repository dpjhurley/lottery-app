import { validationMiddleware } from '@lottery-app/core/middleware';
import { APIGatewayProxyEventV2 } from 'aws-lambda';
import * as stepFunction from 'src/utils/stepFunction';
import { cognito } from '@lottery-app/core/service';
import middy from '@middy/core';

type ParsedAPIGatewayProxyEventV2 = Omit<APIGatewayProxyEventV2, 'body'> & {
    body: {
        email: string;
        password: string;
    };
};

const createUserTriggerHandler = async (
    event: ParsedAPIGatewayProxyEventV2
) => {
    if (!process.env.STATE_MACHINE) {
        console.error('No state machine found');
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Internal server error',
            }),
        };
    }

    const { body } = event;

    try {
        if (!(await cognito.isUniqueEmail(body.email))) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'User already exists' }),
            };
        }

        const response = await stepFunction.trigger({
            input: JSON.stringify(event.body),
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

export const handler = middy(createUserTriggerHandler)
    .use(validationMiddleware.validateNonEmptyUnparsedBodyMiddleware())
    .use(validationMiddleware.validateCreateUserMiddleware());
