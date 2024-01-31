import { StackContext, Function, use } from 'sst/constructs';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import { LambdaInvoke } from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { ApiStack } from './ApiStack';
import { AuthStack } from './AuthStack';

// Step Function to create a user
export const CreateUserSFStack = ({ stack }: StackContext) => {
    const { auth } = use(AuthStack);
    const { api } = use(ApiStack);

    const createUserTask = new LambdaInvoke(stack, 'createUserTask', {
        lambdaFunction: new Function(stack, 'CreateUser-func', {
            handler: 'packages/functions/src/auth/createUser.handler',
            environment: {
                USER_POOL_CLIENT_ID: auth.userPoolClientId,
            },
        }),
        outputPath: '$.Payload',
    });

    const sSuccess = new sfn.Succeed(stack, 'Success');

    const stateDefinition = sfn.Chain.start(createUserTask).next(sSuccess);
    const stateMachine = new sfn.StateMachine(stack, 'CreateUserStateMachine', {
        definitionBody: sfn.DefinitionBody.fromChainable(stateDefinition),
    });

    api.addRoutes(stack, {
        'POST /auth/signup': {
            function: {
                handler:
                    'packages/functions/src/public/stepFunctionTriggers/createUserTrigger.handler',
                environment: {
                    STATE_MACHINE: stateMachine.stateMachineArn,
                    USER_POOL_ID: auth.userPoolId,
                },
                permissions: ['cognito-idp:AdminGetUser'],
            },
        },
    });

    api.attachPermissionsToRoute('POST /auth/signup', [
        [stateMachine, 'grantStartExecution'],
    ]);
};
