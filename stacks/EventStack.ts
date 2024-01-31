import { EventBus, StackContext } from 'sst/constructs';

export const EventStack = ({ stack }: StackContext) => {
    const notificationEventBus = new EventBus(
        stack,
        'notificationBus',
        {
            rules: {
                sendWinner: {
                    pattern: {
                        source: ['user.notifications'],
                        detailType: ['winnerSelected'],
                    },
                    targets: {
                        userMail:
                            'packages/functions/src/notification/mail.sendWinnerEmail',
                    },
                },
                sendAdminWinner: {
                    pattern: {
                        source: ['admin.notifications'],
                        detailType: ['winnerSelected'],
                    },
                    targets: {
                        adminMail:
                            'packages/functions/src/notification/mail.sendAdminWinnerEmail',
                    },
                },
            },
        }
    );

    notificationEventBus.attachPermissions(['ses:SendEmail']);

    return {
        notificationEventBus,
    };
};
