import { Api, StackContext, use } from 'sst/constructs';
import { StorageStack } from './StorageStack';
import { CreateUserSFStack } from './CreateUserSFStack';

export function ApiStack({ stack }: StackContext) {
    const { userTable } = use(StorageStack);
    // const { stateMachine } = use(CreateUserSFStack);

    const api = new Api(stack, 'Api', {
        defaults: {
            authorizer: 'iam',
            function: {
                bind: [userTable],
            },
        },
        routes: {
            // Public routes
            'GET /public/lottery/winner':
                'packages/functions/src/public/lottery.isWinner',
            // 'POST /test': {
            //     stateMachine: stateMachine,
            // },
        },
    });

    // TODO: This needs to be locked down more so only admins can do this but for now it's fine
    const adminApi = new Api(stack, 'AdminApi', {
        defaults: {
            authorizer: 'iam',
            function: {
                bind: [userTable],
            },
        },
        routes: {
            // Admin routes
            'GET /admin/users': 'packages/functions/src/admin/user.getUsers',
            'GET /admin/user/{id}': 'packages/functions/src/admin/user.getUser',
            'PATCH /admin/user/{id}':
                'packages/functions/src/admin/user.updateUser',
            'DELETE /admin/user/{id}':
                'packages/functions/src/admin/user.deleteUser',
            'POST /admin/lottery': 'packages/functions/src/admin.lottery',
        },
    });

    // Show the API endpoint in the output
    stack.addOutputs({
        ApiEndpoint: api.url,
        AdminApiEndpoint: adminApi.url,
    });

    // Return the API resource
    return {
        api,
        adminApi,
    };
}
