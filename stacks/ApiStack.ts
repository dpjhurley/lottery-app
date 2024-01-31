import { Api, StackContext, use } from 'sst/constructs';
import { StorageStack } from './StorageStack';

export const ApiStack = ({ stack }: StackContext) => {
    const { lotteryWinnersTable } = use(StorageStack);

    const api = new Api(stack, 'Api', {
        routes: {
            // Public routes
            'POST /public/lottery/winner': {
                function: {
                    handler: 'packages/functions/src/public/lotteryWins.handler',
                    environment: {
                        LOTTERY_WINNERS_TABLE: lotteryWinnersTable.tableName,
                    },
                    permissions: ['dynamodb:Query'],
                },
            },
            // Admin routes
            'GET /admin/users': {
                // authorizer: 'iam',
                function: 'packages/functions/src/admin/user.getUsers',
            },
            'GET /admin/user/{id}': {
                // authorizer: 'iam',
                function: 'packages/functions/src/admin/user.getUser',
            },
            'DELETE /admin/user/{id}': {
                // authorizer: 'iam',
                function: 'packages/functions/src/admin/user.deleteUser',
            },
        },
    });

    // Show the API endpoint in the output
    stack.addOutputs({
        ApiEndpoint: api.url,
    });

    // Return the API resource
    return {
        api,
    };
};
