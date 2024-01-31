import { EmailEvent } from '@lottery-app/core/types/types';
import { ses } from '@lottery-app/core/service';
import { APIGatewayProxyEventV2 } from 'aws-lambda';

export const sendWinnerEmail = async (
    event: APIGatewayProxyEventV2 & EmailEvent
) => {
    const { email } = event.detail;

    try {
        const data = await ses.sendWinnerEmail(email);
        console.log('Email sent! Message Id:', data.MessageId);

        return data;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

export const sendAdminWinnerEmail = async (
    event: APIGatewayProxyEventV2 & EmailEvent
) => {
    const { email, username } = event.detail;

    try {
        const data = await ses.sendAdminWinnerEmail(email, username);
        console.log('Email sent! Message Id:', data.MessageId);

        return data;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};
