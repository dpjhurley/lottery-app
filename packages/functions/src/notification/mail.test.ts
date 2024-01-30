import { EmailEvent } from '@lottery-app/core/types/types';
import { sendWinnerEmail, sendAdminWinnerEmail } from './mail';
import { APIGatewayProxyEventV2 } from 'aws-lambda';

const mockSendWinnerEmail = jest.fn();
const mockSendAdminWinnerEmail = jest.fn();
jest.mock('./ses', () => ({
    sendWinnerEmail: mockSendWinnerEmail,
    sendAdminWinnerEmail: mockSendAdminWinnerEmail,
}));

describe('sendWinnerEmail', () => {
    const mockEvent = {
        detail: {
            email: 'foo@bar.com',
        },
    } as APIGatewayProxyEventV2 & EmailEvent;

    it('should send an email to the winner', async () => {
        // Arrange
        mockSendWinnerEmail.mockImplementationOnce(() => {
            return {
                MessageId: '123',
            };
        });

        // Act
        // Assert
        expect(await sendWinnerEmail(mockEvent)).toEqual({
            MessageId: '123',
        });
    });

    it('should handle errors when sending an email to the winner', async () => {
        // Arrange
        mockSendWinnerEmail.mockImplementationOnce(
            () => new Error('Failed to send email')
        );

        // Act
        // Assert
        expect(await sendWinnerEmail(mockEvent)).rejects.toThrow();
    });
});

describe('sendAdminWinnerEmail', () => {
    const mockEvent = {
        detail: {
            email: 'foo@bar.com',
            username: 'foo',
        },
    } as APIGatewayProxyEventV2 & EmailEvent;

    it('should send an email to the admin', async () => {
        // Arrange
        mockSendAdminWinnerEmail.mockImplementationOnce(() => {
            return {
                MessageId: '123',
            };
        });

        // Act
        // Assert
        expect(await sendAdminWinnerEmail(mockEvent)).toEqual({
            MessageId: '123',
        });
    });

    it('should handle errors when sending an email to the admin', async () => {
        // Arrange
        mockSendAdminWinnerEmail.mockImplementationOnce(
            () => new Error('Failed to send email')
        );

        // Act
        // Assert
        expect(await sendAdminWinnerEmail(mockEvent)).rejects.toThrow();
    });
});
