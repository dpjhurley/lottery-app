import { StackContext, Function, use } from 'sst/constructs';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import {
    LambdaInvoke,
    EventBridgePutEvents,
} from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { ApiStack } from './ApiStack';
import { AuthStack } from './AuthStack';
import { EventStack } from './EventStack';
import * as events from 'aws-cdk-lib/aws-events';

// Step Function to create a user
export const CreateUserSFStack = ({ stack }: StackContext) => {
    const { auth } = use(AuthStack);
    const { api } = use(ApiStack);
    const { userNotificationEventBus } = use(EventStack);

    // Define each state
    const createUserTask = new LambdaInvoke(stack, 'createUserTask', {
        lambdaFunction: new Function(stack, 'CreateUser-func', {
            handler: 'packages/functions/src/user.createUser',
            environment: {
                USER_POOL_CLIENT_ID: auth.userPoolClientId,
            },
        }),
        outputPath: '$.Payload',
    });

    // Needed to use the type from the cdk to get the step function task to work
    const cdkEventBus = events.EventBus.fromEventBusArn(
        stack,
        'NotificationBus-CdkCopy',
        userNotificationEventBus.eventBusArn
    );

    const putNotificationEventTask = new EventBridgePutEvents(
        stack,
        userNotificationEventBus.id,
        {
            entries: [
                {
                    eventBus: cdkEventBus,
                    source: 'user.notifications',
                    detailType: 'userCreated',
                    detail: sfn.TaskInput.fromObject({
                        email: sfn.JsonPath.stringAt('$.Payload.email'),
                        text: 'Welcome to the Lottery App!, please confirm your email with the following link',
                    }),
                },
            ],
        }
    );

    // const sFailed = new sfn.Fail(stack, 'Failed');
    const sSuccess = new sfn.Succeed(stack, 'Success');

    // Define state machine
    const stateDefinition = sfn.Chain.start(createUserTask)
        .next(putNotificationEventTask)
        .next(sSuccess);

    const stateMachine = new sfn.StateMachine(stack, 'CreateUserStateMachine', {
        definitionBody: sfn.DefinitionBody.fromChainable(stateDefinition),
    });

    api.addRoutes(stack, {
        'POST /auth/signup': {
            function: {
                handler: 'packages/functions/src/stateMachineTrigger/executeCreateUser.handler',
                environment: {
                    STATE_MACHINE: stateMachine.stateMachineArn,
                },
            },
        },
    });

    api.attachPermissionsToRoute('POST /auth/signup', [
        [stateMachine, 'grantStartExecution'],
    ]);
};
