// import { ApiHandler } from 'sst/node/api';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { APIGatewayProxyEventV2 } from 'aws-lambda';

const ses = new SESClient();

interface EmailInput {
    email: string;
    text: string;
}

interface EmailEvent {
    detail: EmailInput;
}

export const sendWelcomeEmail = async (
    event: APIGatewayProxyEventV2 & EmailEvent
) => {
    const { email, text } = event.detail;

    const command = new SendEmailCommand({
        Destination: {
            ToAddresses: [email],
        },
        Message: {
            Body: {
                Text: {
                    Charset: 'UTF-8',
                    Data: text,
                },
            },
            Subject: {
                Charset: 'UTF-8',
                Data: 'Welcome Email',
            },
        },
        Source: 'no-reply@verificationemail.com',
    });

    try {
        const data = await ses.send(command);
        console.log('Email sent! Message Id:', data.MessageId);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Mail sent successfully' }),
        };
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

// export const sendSms = ApiHandler(async (_evt) => {
//     // Your sendSms logic here
//     return {
//         statusCode: 200,
//         body: JSON.stringify({ message: 'Sms sent successfully' }),
//     };
// });

// export const sendWinnerEmail = ApiHandler(async (_evt) => {
//     // Your sendWinnerEmail logic here, for now okay but maybe should use AWS SNS
//     console.log('HERE sendWinnerEmail');
//     return {
//         statusCode: 200,
//         body: JSON.stringify({ message: 'Mail sent successfully' }),
//     };
// });

// export const sendTotalEmail = ApiHandler(async (_evt) => {
//     // Your sendTotalEmail logic here, for now okay but maybe should use AWS SNS
//     console.log('HERE sendTotalEmail');
//     return {
//         statusCode: 200,
//         body: JSON.stringify({ message: 'Mail sent successfully' }),
//     };
// });
