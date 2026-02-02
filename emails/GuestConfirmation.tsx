
import React from 'react';
import {
    Html,
    Body,
    Head,
    Heading,
    Container,
    Preview,
    Section,
    Text,
    Img,
    Link,
    Hr,
} from '@react-email/components';

interface GuestConfirmationProps {
    guestName?: string;
    productName: string;
    price: string;
    propertyName: string;
    propertyAddress: string;
    checkInTime?: string;
    checkOutTime?: string;
    newTime?: string;
}

export const GuestConfirmation = ({
    guestName = 'Guest',
    productName = 'Early Check-in',
    price = '£12.50',
    propertyName = 'Haven',
    propertyAddress = '330 Upper Street, London',
    newTime = '2:00 PM',
}: GuestConfirmationProps) => {
    const isCheckIn = productName.toLowerCase().includes('check-in');
    const timeLabel = isCheckIn ? 'New Check-in Time' : 'New Check-out Time';

    return (
        <Html>
            <Head />
            <Preview>Receipt for your {productName} at {propertyName}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Heading style={h1}>{propertyName.toUpperCase()}</Heading>
                    <Text style={heroText}>Use Your New Time</Text>

                    <Section style={box}>
                        <Text style={paragraph}>Hi {guestName},</Text>
                        <Text style={paragraph}>
                            Thank you for confirming your <strong>{productName}</strong>.
                        </Text>
                        <Hr style={hr} />
                        <Text style={label}>{timeLabel}</Text>
                        <Text style={timeValue}>{newTime}</Text>

                        <Text style={paragraph}>
                            Please use your standard access code to enter at this new time.
                        </Text>
                        <Hr style={hr} />
                        <Text style={paragraph}>
                            Total Paid: <strong>{price}</strong>
                        </Text>
                    </Section>

                    <Text style={footer}>
                        {propertyName} • {propertyAddress}
                    </Text>
                </Container>
            </Body>
        </Html>
    );
};

// Styles
const main = {
    backgroundColor: '#f6f9fc',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
    backgroundColor: '#ffffff',
    margin: '0 auto',
    padding: '40px 0 48px',
    marginBottom: '64px',
};

const h1 = {
    color: '#1a1a1a',
    fontFamily: 'Georgia, serif', // Serif for luxury feel
    fontSize: '32px',
    fontWeight: '400',
    textAlign: 'center' as const,
    margin: '0 0 10px',
    letterSpacing: '4px',
};

const heroText = {
    fontSize: '18px',
    textAlign: 'center' as const,
    color: '#666',
    marginBottom: '40px',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
};

const box = {
    padding: '40px',
    backgroundColor: '#fafafa', // Slightly off-white box
    border: '1px solid #eaeaea',
    marginBottom: '40px',
};

const paragraph = {
    fontSize: '16px',
    lineHeight: '26px',
    color: '#444',
    marginBottom: '16px',
};

const label = {
    fontSize: '14px',
    color: '#8898aa',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
    marginTop: '20px',
    marginBottom: '8px',
};

const timeValue = {
    fontSize: '36px',
    fontFamily: 'Georgia, serif',
    color: '#1a1a1a',
    fontWeight: 'bold',
    marginTop: '0',
    marginBottom: '20px',
};

const hr = {
    borderColor: '#e6ebf1',
    margin: '24px 0',
};

const footer = {
    color: '#8898aa',
    fontSize: '12px',
    textAlign: 'center' as const,
};

export default GuestConfirmation;
