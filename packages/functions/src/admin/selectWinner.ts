import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { dynamo, cognito } from '@lottery-app/core/service';

export const handler = async (event: APIGatewayProxyEventV2) => {
    if (!process.env.LOTTERY_WINNERS_TABLE) {
        throw new Error('No lottery winners table found');
    }

    try {
        // get all the users from cognito, then randomly select one
        const userList = await cognito.listConfirmedUsers();

        const winner = await dynamo.addWinnerToTable(
            process.env.LOTTERY_WINNERS_TABLE,
            userList
        );

        return {
            Payload: {
                email: winner.email,
                username: winner.username,
            },
        };
    } catch (error) {
        throw error;
    }
};
