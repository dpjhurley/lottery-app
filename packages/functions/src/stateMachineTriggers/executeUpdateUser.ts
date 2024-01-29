import { SFNClient, StartExecutionCommand } from '@aws-sdk/client-sfn';
import { ApiHandler } from 'sst/node/api';

export const handler = ApiHandler(async (_evt) => {

    // TODO: Need to validate that we have the right inputs and check if the user exists already before starting the state machine
    if (!process.env.STATE_MACHINE) {
        console.error('No state machine found');
        return {
            statusCode: 500,
            body: JSON.stringify({
                text: 'Internal server error',
            }),
        };
    }

    //Create the Step Function client
    const client = new SFNClient({});
    try {
        // Send a command to this client to start the state machine which ARN is specified
        const response = await client.send(
            new StartExecutionCommand({
                stateMachineArn: process.env.STATE_MACHINE,
                input: JSON.stringify(_evt.body),
            })
        );

        const { executionArn } = response;
        // For logging purposes I'm splitting up the executionArn to get the executionId of the state machine
        const executionId = executionArn?.split(':').slice(-1)[0];

        return {
            statusCode: 200,
            body: JSON.stringify({
                text: 'Start machine started',
                executionId,
            }),
        };
    } catch (error) {
        console.error('Error starting state machine: ', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                text: 'Internal server error',
            }),
        };
    }
});
