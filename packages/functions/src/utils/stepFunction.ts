import { SFNClient, StartExecutionCommand } from '@aws-sdk/client-sfn';

interface TriggerInput {
    input: string;
    sfArn: string;
}

export const trigger = async ({ input, sfArn }: TriggerInput) => {
    //Create the Step Function client
    const client = new SFNClient({});

    try {
        // Send a command to this client to start the state machine which ARN is specified
        const response = await client.send(
            new StartExecutionCommand({
                stateMachineArn: sfArn,
                input,
            })
        );

        const { executionArn } = response;
        // For logging purposes I'm splitting up the executionArn to get the executionId of the state machine
        return executionArn?.split(':').slice(-1)[0];
    } catch (error) {
        console.error('Error starting state machine: ', error);
        throw error;
    }
};
