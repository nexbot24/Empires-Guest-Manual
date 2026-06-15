
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
    Hr,
} from '@react-email/components';

interface HostAlertProps {
    guestName?: string;
    productName: string;
    productId: string;
    price: string;
    propertyName: string;
    selectedTime: string;
}

export const HostAlert = ({
    guestName = 'A Guest',
    productName = 'Early Check-in',
    productId = 'early-checkin',
    price = '£20.00',
    propertyName = 'Haven',
    selectedTime = '',
}: HostAlertProps) => {
    const isHourly = productId === 'early-checkin' || productId === 'late-checkout';

    const getItemDetail = () => {
        if (isHourly && selectedTime) {
            return `${productName} — ${selectedTime}`;
        }
        return productName;
    };

    return (
        <Html>
            <Head />
            <Preview>New Purchase: {productName} ({propertyName})</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Heading style={h1}>New Store Order</Heading>

                    <Section style={box}>
                        <Text style={paragraph}>
                            <strong>Property:</strong> {propertyName}
                        </Text>
                        <Text style={paragraph}>
                            <strong>Guest:</strong> {guestName}
                        </Text>
                        <Text style={paragraph}>
                            <strong>Item:</strong> {getItemDetail()}
                        </Text>
                        <Text style={paragraph}>
                            <strong>Price:</strong> {price}
                        </Text>
                        <Hr style={hr} />
                        <Text style={paragraph}>
                            Please ensure the cleaners or relevant staff are aware of the schedule change.
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

const main = {
    backgroundColor: '#ffffff',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
};

const container = {
    margin: '0 auto',
    padding: '20px 0 48px',
};

const h1 = {
    color: '#333',
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '30px 0',
};

const box = {
    padding: '24px',
    backgroundColor: '#f0f0f0',
    borderRadius: '4px',
};

const paragraph = {
    fontSize: '16px',
    lineHeight: '26px',
    color: '#333',
};

const hr = {
    borderColor: '#cccccc',
    margin: '20px 0',
};

export default HostAlert;
