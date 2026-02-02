
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
    return (
        <Html>
            <Head />
            <Preview>Receipt for your {productName} at {propertyName}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Heading style={h1}>{propertyName}</Heading>
                    <Text style={heroText}>Use Your New Time</Text>

                    <Section style={box}>
                        <Text style={paragraph}>Hi {guestName},</Text>
                        <Text style={paragraph}>
                            Thank you for purchasing <strong>{productName}</strong>. Your payment was successful.
                        </Text>
                        <Hr style={hr} />
                        <Text style={paragraph}>
                            <strong>New Time:</strong> {newTime}
                        </Text>
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
    padding: '20px 0 48px',
    marginBottom: '64px',
};

const h1 = {
    color: '#333',
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'center' as const,
    margin: '30px 0',
    textTransform: 'uppercase' as const,
    letterSpacing: '4px',
};

const heroText = {
    fontSize: '20px',
    lineHeight: '26px',
    textAlign: 'center' as const,
    color: '#484848',
    marginBottom: '20px',
};

const box = {
    padding: '24px',
    backgroundColor: '#f9f9f9',
    borderRadius: '12px',
    margin: '0 24px',
};

const paragraph = {
    fontSize: '16px',
    lineHeight: '26px',
    color: '#484848',
};

const hr = {
    borderColor: '#e6ebf1',
    margin: '20px 0',
};

const footer = {
    color: '#8898aa',
    fontSize: '12px',
    marginLeft: '4px',
    marginRight: '4px',
    marginTop: '24px',
    textAlign: 'center' as const,
};

export default GuestConfirmation;
