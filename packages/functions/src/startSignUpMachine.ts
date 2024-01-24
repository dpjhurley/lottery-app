import { SFNClient, StartExecutionCommand } from '@aws-sdk/client-sfn';
import { ApiHandler } from 'sst/node/api';

export const handler = ApiHandler(async (_evt) => {
    const client = new SFNClient({}); //Create the Step Function client

    // Send a command to this client to start the state machine which ARN is specified
    const response = await client.send(
        new StartExecutionCommand({
            stateMachineArn: process.env.STATE_MACHINE,
        })
    );

    const { requestId, cfId, extendedRequestId } = response.$metadata;

    const { executionArn } = response;

    return {
        statusCode: 200,
        body: JSON.stringify({
            tex: 'Start machine started',
            requestId,
            cfId,
            extendedRequestId,
            executionArn,
            executionid: executionArn?.split(':').slice(-1)[0] || null,
        }),
    };
});
