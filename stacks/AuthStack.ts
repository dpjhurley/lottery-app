import { ApiStack } from './ApiStack';
import { Cognito, StackContext, use } from 'sst/constructs';


export const AuthStack = ({ stack, app }: StackContext) => {
    const { api } = use(ApiStack);

    // Create a Cognito User Pool and Identity Pool
    const auth = new Cognito(stack, 'LotteryUsers', {
        login: ['email'],
    });

    auth.attachPermissionsForAuthUsers(stack, [
        // Allow access to the API
        api,
    ]);

    // Show the auth resources in the output
    stack.addOutputs({
        Region: app.region,
        UserPoolId: auth.userPoolId,
        UserPoolClientId: auth.userPoolClientId,
        IdentityPoolId: auth.cognitoIdentityPoolId,
    });

    // Return the auth resource
    return {
        auth,
    };
}
