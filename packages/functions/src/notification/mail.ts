import { ApiHandler } from 'sst/node/api';
import { SES } from 'aws-sdk';
import { APIGatewayProxyEventV2 } from 'aws-lambda';

const ses = new SES();

interface EmailInput {
    email: string;
}

interface EmailEvent {
    detail: EmailInput;
}

export const sendEmail = async (event: APIGatewayProxyEventV2 & EmailEvent) => {
    // Your sendEmail logic here, for now okay but maybe should use AWS SNS
    console.log('HERE sendEmail', { event: event });

    const emailAddress = event.detail.email; // Extract the email address from the event

    const params = {
        Destination: {
            ToAddresses: [emailAddress],
        },
        Message: {
            Body: {
                Text: {
                    Charset: 'UTF-8',
                    Data: 'Hello, this is a test email.',
                },
            },
            Subject: {
                Charset: 'UTF-8',
                Data: 'Test Email',
            },
        },
        Source: 'sender@example.com',
    };

    try {
        const data = await ses.sendEmail(params).promise();
        console.log('Email sent! Message Id:', data.MessageId);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Mail sent successfully' }),
        };
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

export const sendSms = ApiHandler(async (_evt) => {
    // Your sendSms logic here
    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Sms sent successfully' }),
    };
});

export const sendWinnerEmail = ApiHandler(async (_evt) => {
    // Your sendWinnerEmail logic here, for now okay but maybe should use AWS SNS
    console.log('HERE sendWinnerEmail');
    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Mail sent successfully' }),
    };
});

export const sendTotalEmail = ApiHandler(async (_evt) => {
    // Your sendTotalEmail logic here, for now okay but maybe should use AWS SNS
    console.log('HERE sendTotalEmail');
    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Mail sent successfully' }),
    };
});
