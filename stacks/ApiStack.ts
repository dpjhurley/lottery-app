import { Api, StackContext, use } from 'sst/constructs';
import { StorageStack } from './StorageStack';

export const ApiStack = ({ stack }: StackContext) => {
    const { userTable } = use(StorageStack);

    const api = new Api(stack, 'Api', {
        routes: {
            // Public routes
            'GET /public/lottery/winner': {
                authorizer: 'iam',
                function: {
                    handler: 'packages/functions/src/public/lottery.isWinner',
                    bind: [userTable],
                },
            },
            // Admin routes
            'GET /admin/users': {
                authorizer: 'iam',
                function: 'packages/functions/src/admin/user.getUsers',
            },
            'GET /admin/user/{id}': {
                authorizer: 'iam',
                function: 'packages/functions/src/admin/user.getUser',
            },
            'PATCH /admin/user/{id}': {
                authorizer: 'iam',
                function: 'packages/functions/src/admin/user.updateUser',
            },
            'DELETE /admin/user/{id}': {
                authorizer: 'iam',
                function: 'packages/functions/src/admin/user.deleteUser',
            },
            'POST /admin/lottery': {
                authorizer: 'iam',
                function: {
                    handler: 'packages/functions/src/admin.lottery',
                    bind: [userTable],
                },
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
}
