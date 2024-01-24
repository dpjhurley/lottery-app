import { StackContext, Function } from 'sst/constructs';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import { LambdaInvoke } from 'aws-cdk-lib/aws-stepfunctions-tasks';

// Step Function to create a user
export const CreateUserSFStack = ({ stack, app }: StackContext) => {

    // Define each state
    const createUserTask = new LambdaInvoke(stack, 'createUserTask', {
        lambdaFunction: new Function(stack, 'CreateUser', {
            handler: 'packages/functions/src/createUser.handler',
            environment: {
                // TODO: This should be a parameter passed in from auth or the stack
                USER_POOL_ID: 'auth.userPoolId',
            },
        }),
    });

    // const sFailed = new sfn.Fail(stack, 'Failed');
    const sSuccess = new sfn.Succeed(stack, 'Success');

    // Define state machine
    const stateDefinition = sfn.Chain.start(createUserTask).next(sSuccess);

    const stateMachine = new sfn.StateMachine(stack, 'CreateUserStateMachine', {
        definitionBody: sfn.DefinitionBody.fromChainable(stateDefinition),
    });

    return {
        stateMachine
    }
};
