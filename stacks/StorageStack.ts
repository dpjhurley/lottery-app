import { StackContext, Table } from 'sst/constructs';

export const StorageStack = ({ stack }: StackContext) => {
    const lotteryWinnersTable = new Table(stack, 'LotteryWinners', {
        fields: {
            username: 'string',
            SK: 'string',
        },
        primaryIndex: {
            partitionKey: 'username',
            sortKey: 'SK' 
        },
    });

    return {
        lotteryWinnersTable,
    };
}
