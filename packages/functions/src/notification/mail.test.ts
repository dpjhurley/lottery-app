import { EmailEvent } from '@lottery-app/core/types/types';
import { sendWinnerEmail, sendAdminWinnerEmail } from './mail';
import { APIGatewayProxyEventV2 } from 'aws-lambda';

const mockSendWinnerEmail = jest.fn();
const mockSendAdminWinnerEmail = jest.fn();

jest.mock('../../../core/src/service/ses', () => ({
    sendWinnerEmail: jest.fn().mockImplementation(() => mockSendWinnerEmail()),
    sendAdminWinnerEmail: jest
        .fn()
        .mockImplementation(() => mockSendAdminWinnerEmail()),
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
        mockSendWinnerEmail.mockImplementationOnce(() => {
            throw new Error('Failed to send email');
        });

        // Act
        // Assert
        await expect(sendWinnerEmail(mockEvent)).rejects.toThrow('Failed to send email');
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
        mockSendAdminWinnerEmail.mockImplementationOnce(() => {
            throw new Error('Failed to send email');
        });
    
        // Act and Assert
        await expect(sendAdminWinnerEmail(mockEvent)).rejects.toThrow('Failed to send email');
    });
});
