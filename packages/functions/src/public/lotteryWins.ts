import middy from '@middy/core';
import { validationMiddleware } from '@lottery-app/core/middleware';
import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { dynamo } from '@lottery-app/core/service';

type ParsedAPIGatewayProxyEventV2 = Omit<APIGatewayProxyEventV2, 'body'> & {
    body: {
        username: string;
    };
};

export const lotteryWinsHandler = async (event: ParsedAPIGatewayProxyEventV2) => {
    if (!process.env.LOTTERY_WINNERS_TABLE) {
        console.error('No lottery winners table found');
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Internal server error',
            }),
        };
    }

    const { body } = event;

    try {
        const wins = await dynamo.getUserWins(process.env.LOTTERY_WINNERS_TABLE, body.username);
        return {
            statusCode: 200,
            body: JSON.stringify(wins),
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

export const handler = middy(lotteryWinsHandler)
    .use(validationMiddleware.validateNonEmptyUnparsedBodyMiddleware())
    .use(validationMiddleware.validateLotteryWinnerMiddleware());
