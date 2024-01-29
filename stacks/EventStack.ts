import { EventBus, StackContext } from 'sst/constructs';

export const EventStack = ({ stack }: StackContext) => {
    const userNotificationEventBus = new EventBus(
        stack,
        'UserNotificationBus',
        {
            rules: {
                sendConfirmation: {
                    pattern: {
                        source: ['user.notifications'],
                        detailType: ['userCreated'],
                    },
                    targets: {
                        userMail:
                            'packages/functions/src/notification/mail.sendWelcomeEmail',
                    },
                },
            },
        }
    );

    userNotificationEventBus.attachPermissions(["ses:SendEmail"]);

    const adminNotificationEventBus = new EventBus(
        stack,
        'AdminNotificationBus',
        {
            rules: {
                sendWinner: {
                    pattern: {
                        source: ['admin.notifications'],
                        detailType: ['winnerSelected'],
                    },
                    targets: {
                        userMail:
                            'packages/functions/src/notification/mail.sendWinnerEmail',
                    },
                },
                currentTotalWinner: {
                    pattern: {
                        source: ['admin.notifications'],
                        detailType: ['winnerTotal'],
                    },
                    targets: {
                        userMail:
                            'packages/functions/src/notification/mail.sendTotalEmail',
                    },
                },
            },
        }
    );

    return {
        userNotificationEventBus,
        adminNotificationEventBus,
    };
};
