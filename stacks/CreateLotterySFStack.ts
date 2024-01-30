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
import { StorageStack } from './StorageStack';

export const CreateLotterySFStack = ({ stack }: StackContext) => {
    const { auth } = use(AuthStack);
    const { api } = use(ApiStack);
    const { notificationEventBus } = use(EventStack);
    const { lotteryWinnersTable } = use(StorageStack);

    // Define each state
    const selectWinnerTask = new LambdaInvoke(stack, 'selectWinnerTask', {
        lambdaFunction: new Function(stack, 'SelectWinner-func', {
            handler: 'packages/functions/src/admin/selectWinner.handler',
            environment: {
                USER_POOL_ID: auth.userPoolId,
                LOTTERY_WINNERS_TABLE: lotteryWinnersTable.tableName,
            },
            permissions: ['cognito-idp:ListUsers', "dynamodb:PutItem"],
        }),
        outputPath: '$.Payload',
    });

    // Needed to use the type from the cdk to get the step function task to work
    const cdkEventBus = events.EventBus.fromEventBusArn(
        stack,
        'NotificationBus-CdkCopy',
        notificationEventBus.eventBusArn
    );

    const winnerNotificationEventTask = new EventBridgePutEvents(
        stack,
        `${notificationEventBus.id}-user`,
        {
            entries: [
                {
                    eventBus: cdkEventBus,
                    source: 'user.notifications',
                    detailType: 'winnerSelected',
                    detail: sfn.TaskInput.fromObject({
                        email: sfn.JsonPath.stringAt('$.Payload.email'),
                    }),
                },
            ],
        }
    );

    const winnerAdminNotificationEventTask = new EventBridgePutEvents(
        stack,
        `${notificationEventBus.id}-admin`,
        {
            entries: [
                {
                    eventBus: cdkEventBus,
                    source: 'admin.notifications',
                    detailType: 'winnerSelected',
                    detail: sfn.TaskInput.fromObject({
                        username: sfn.JsonPath.stringAt('$.Payload.username'),
                        email: sfn.JsonPath.stringAt('$.Payload.email'),
                    }),
                },
            ],
        }
    );

    const sSuccess = new sfn.Succeed(stack, 'Success');

    const parallel = new sfn.Parallel(stack, 'ParallelCompute');

    // Define state machine
    const stateDefinition = sfn.Chain.start(selectWinnerTask)
        .next(
            parallel
                .branch(winnerNotificationEventTask)
                .branch(winnerAdminNotificationEventTask)
        )
        .next(sSuccess);

    const stateMachine = new sfn.StateMachine(
        stack,
        'CreateLotteryStateMachine',
        {
            definitionBody: sfn.DefinitionBody.fromChainable(stateDefinition),
        }
    );

    api.addRoutes(stack, {
        'POST /admin/lottery': {
            // authorizer: "iam",
            function: {
                handler:
                    'packages/functions/src/admin/stepFunctionTriggers/createLotteryTrigger.handler',
                environment: {
                    STATE_MACHINE: stateMachine.stateMachineArn,
                    USER_POOL_ID: auth.userPoolId,
                },
            },
        },
    });

    api.attachPermissionsToRoute('POST /admin/lottery', [
        [stateMachine, 'grantStartExecution'],
    ]);
};
