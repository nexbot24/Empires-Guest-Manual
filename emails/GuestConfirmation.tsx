
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
    propertyId?: string;
}

export const GuestConfirmation = ({
    guestName = 'Guest',
    productName = 'Early Check-in',
    price = '£12.50',
    propertyName = 'Haven',
    propertyAddress = '330 Upper Street, London',
    newTime = '2:00 PM',
    propertyId = 'haven',
}: GuestConfirmationProps) => {
    const isCheckIn = productName.toLowerCase().includes('check-in');
    const timeLabel = isCheckIn ? 'New Check-in Time' : 'New Check-out Time';

    // Dynamic logo URL based on property
    // Default to a safe placeholder if logic fails, but standard is sub-domain based.
    const baseUrl = propertyId === 'vibe'
        ? 'https://vibe.empiresproperty.co.uk'
        : 'https://haven.empiresproperty.co.uk';

    // Fallback logic for local dev if needed, but for email we need absolute public URLs
    const logoUrl = `${baseUrl}/logo.png`;

    return (
        <Html>
            <Head />
            <Preview>Receipt for your {productName} at {propertyName}</Preview>
            <Body style={main}>
                <Container style={container}>
                    {/* Logo Section */}
                    <Section style={{ textAlign: 'center' as const, marginTop: '32px', marginBottom: '32px' }}>
                        <Img
                            src={logoUrl}
                            alt={propertyName}
                            width="64"
                            height="64"
                            style={{ margin: '0 auto' }}
                        />
                    </Section>

                    <Heading style={h1}>{propertyName.toUpperCase()}</Heading>
                    <Text style={heroText}>USE YOUR NEW TIME</Text>

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
                            Total Paid: <strong style={{ color: '#1C1917' }}>{price}</strong>
                        </Text>
                    </Section>

                    <Text style={footer}>
                        {propertyName} • {propertyAddress}
                    </Text>
                    <Text style={footerLinks}>
                        Sent with ♥ by Empires Property
                    </Text>
                </Container>
            </Body>
        </Html>
    );
};

// Luxury Brand Colors matches tailwind.config.ts
// Earth: #8B735B
// Sand: #F5F2EF
// Luxury Black: #1C1917
// Luxury Off: #E8E2DA

const main = {
    backgroundColor: '#F5F2EF', // Sand
    fontFamily: '"Bodoni Moda", Georgia, "Times New Roman", serif',
};

const container = {
    backgroundColor: '#F5F2EF', // Seamless blend with body
    margin: '0 auto',
    padding: '0px 0 48px',
    marginBottom: '64px',
};

const h1 = {
    color: '#1C1917', // Luxury Black
    fontFamily: '"Bodoni Moda", Georgia, serif',
    fontSize: '32px',
    fontWeight: '400',
    textAlign: 'center' as const,
    margin: '0 0 16px',
    letterSpacing: '0.2em', // tracking-widest
};

const heroText = {
    fontSize: '14px',
    fontFamily: 'Inter, Helvetica, Arial, sans-serif', // Sans for subtitle
    textAlign: 'center' as const,
    color: '#8B735B', // Earth color
    marginBottom: '40px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.15em',
    fontWeight: '600',
};

const box = {
    padding: '40px',
    backgroundColor: '#FFFFFF',
    borderRadius: '2px', // Sharp luxury corners
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
    margin: '0 24px',
    border: '1px solid #E8E2DA', // Luxury Off border
};

const paragraph = {
    fontSize: '16px',
    lineHeight: '26px',
    color: '#444444',
    fontFamily: 'Inter, Helvetica, Arial, sans-serif',
    marginBottom: '16px',
};

const label = {
    fontSize: '12px',
    color: '#8B735B', // Earth
    textTransform: 'uppercase' as const,
    letterSpacing: '2px',
    marginTop: '24px',
    marginBottom: '12px',
    fontFamily: 'Inter, Helvetica, Arial, sans-serif',
    fontWeight: '600',
};

const timeValue = {
    fontSize: '42px',
    fontFamily: '"Bodoni Moda", Georgia, serif',
    color: '#1C1917', // Luxury Black
    fontWeight: '400',
    marginTop: '0',
    marginBottom: '24px',
    letterSpacing: '-0.02em',
};

const hr = {
    borderColor: '#E8E2DA', // Luxury Off
    margin: '24px 0',
};

const footer = {
    color: '#8B735B', // Earth
    fontSize: '12px',
    textAlign: 'center' as const,
    fontFamily: 'Inter, Helvetica, Arial, sans-serif',
    marginTop: '40px',
    letterSpacing: '0.05em',
};

const footerLinks = {
    color: '#8B735B',
    fontSize: '10px',
    textAlign: 'center' as const,
    fontFamily: 'Inter, Helvetica, Arial, sans-serif',
    opacity: '0.6',
    marginTop: '10px',
};

export default GuestConfirmation;
