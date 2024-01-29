import { StackContext, Table } from 'sst/constructs';

export const StorageStack = ({ stack }: StackContext) => {
    const userTable = new Table(stack, 'LotteryWinners', {
        fields: {
            email: 'string'
        },
        primaryIndex: { partitionKey: 'email' },
    });

    return {
        userTable,
    };
}
