import middy from '@middy/core';
import * as stepFunction from 'src/utils/stepFunction';
import {
    validationMiddleware,
    adminMiddleware,
} from '@lottery-app/core/middleware';
import { APIGatewayProxyEventV2 } from 'aws-lambda';

const createLotteryTriggerHandler = async (event: APIGatewayProxyEventV2) => {
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

export const handler = middy(createLotteryTriggerHandler)
    .use(validationMiddleware.validateNonEmptyUnparsedBodyMiddleware())
    .use(adminMiddleware.isAdminMiddleware());
