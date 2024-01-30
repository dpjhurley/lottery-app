import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';


export const createSesClient = () => {
    return new SESClient({});
}

export const sendWinnerEmail = async (to: string) => {
    const sesClient = createSesClient();

    const command = new SendEmailCommand({
        Source: "admin@admin.com",
        Destination: {
            ToAddresses: [to],
        },
        Message: {
            Subject: {
                Data: "Winner!",
            },
            Body: {
                Text: {
                    Data: "Congratulations you are the winner!",
                },
            },
        },
    });

    try {
        return await sesClient.send(command);
    } catch (error) {
        console.error('Error sending email: ', error);
        throw error;
    }
};

export const sendAdminWinnerEmail = async (email: string, username: string) => {
    const sesClient = createSesClient();

    const command = new SendEmailCommand({
        Source: "admin@admin.com",
        Destination: {
            ToAddresses: ["admin@admin.com"],
        },
        Message: {
            Subject: {
                Data: "There has been a winner",
            },
            Body: {
                Text: {
                    Data: `The winner is ${username} with email ${email}`,
                },
            },
        },
    });

    try {
        return await sesClient.send(command);
    } catch (error) {
        console.error('Error sending email: ', error);
        throw error;
    }
};