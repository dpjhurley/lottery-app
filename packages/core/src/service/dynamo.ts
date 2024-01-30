import { UserType } from '@aws-sdk/client-cognito-identity-provider';
import {
    DynamoDBClient,
    PutItemCommand,
    QueryCommand,
    QueryCommandOutput,
    ServiceInputTypes,
} from '@aws-sdk/client-dynamodb';
import { v4 as uuidv4 } from 'uuid';

interface WinningUser {
    email: string;
    username: string;
}

const createDynamoClient = (config?: ServiceInputTypes): DynamoDBClient => {
    const dynamoOptions = {
        region: 'us-east-1',
        ...config,
    };

    return new DynamoDBClient(dynamoOptions);
};

export const getUserWins = async (
    tableName: string,
    username: string
): Promise<QueryCommandOutput['Items']> => {
    const dynamoClient = createDynamoClient();

    const queryParams = {
        TableName: tableName,
        KeyConditionExpression: 'username = :username',
        ExpressionAttributeValues: {
            ':username': { S: username },
        },
    };

    try {
        const queryCommandOutput = await dynamoClient.send(
            new QueryCommand(queryParams)
        );

        return queryCommandOutput.Items || [];
    } catch (error) {
        console.error('Error adding item:', error);
        throw error;
    }
};

export const addWinnerToTable = async (
    tableName: string,
    userList: UserType[]
): Promise<WinningUser> => {
    const dynamoClient = createDynamoClient();

    const winningUser = userList[Math.floor(Math.random() * userList.length)];

    if (
        !winningUser.Username ||
        !winningUser.Attributes ||
        !winningUser.Attributes.length ||
        !winningUser.Attributes.find((attr) => attr.Name === 'email') ||
        !winningUser.Attributes.find((attr) => attr.Name === 'email')?.Value
    ) {
        throw new Error('No winning user found');
    }

    console.log('Winner selected: ', { winningUser });

    const winnerEmail =
        winningUser.Attributes.find((attr) => attr.Name === 'email')?.Value ||
        '';

    const putParams = {
        Item: {
            username: {
                S: winningUser.Username,
            },
            SK: {
                S: uuidv4(),
            },
            email: {
                S: winnerEmail,
            },
            timestamp: {
                S: new Date().toISOString(),
            },
            Tablename: {
                S: tableName,
            },
        },
        TableName: tableName,
    };

    try {
        await dynamoClient.send(new PutItemCommand(putParams));

        return {
            email: winnerEmail,
            username: winningUser.Username,
        };
    } catch (error) {
        throw error;
    }
};
