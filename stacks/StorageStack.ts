import { StackContext, Table } from 'sst/constructs';

export function StorageStack({ stack }: StackContext) {
    const userTable = new Table(stack, 'Users', {
        fields: {
            email: 'string'
        },
        primaryIndex: { partitionKey: 'email' },
    });

    return {
        userTable,
    };
}
