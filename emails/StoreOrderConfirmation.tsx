
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Img,
} from '@react-email/components';
import * as React from 'react';

interface StoreOrderConfirmationProps {
  guestName: string;
  productName: string; // 'Early Check-in' or 'Late Check-out'
  newTime: string;    // '3:00 PM' etc.
  price: string;      // '50.00'
  propertyId?: string;
}

export const StoreOrderConfirmation = ({
  guestName = 'Guest',
  productName = 'Early Check-in',
  newTime = '3:00 PM',
  price = '12.50',
  propertyId = 'haven',
}: StoreOrderConfirmationProps) => {

  const isEarly = productName.toLowerCase().includes('early');
  const actionText = isEarly ? 'Early Check-in' : 'Late Check-out';
  const timeLabel = isEarly ? 'New Check-in Time' : 'New Check-out Time';

  // Determine base URL based on property (or default to main site)
  // Ideally this should be passed in or an env var, but for now we hardcode the known production domains or use a consistent assets host
  const baseUrl = 'https://haven.empiresproperty.co.uk';

  return (
    <Html>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Preview>Your {actionText.toLowerCase()} at {newTime} is confirmed - Empires Property</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <table style={{ width: '100%' }}>
              <tbody>
                <tr>
                  <td style={{ verticalAlign: 'middle' }}>
                    <Img
                      src={`${baseUrl}/assets/email-logo.png`}
                      alt="Empires Property"
                      width="60"
                      height="60"
                      style={{ display: 'block' }}
                    />
                  </td>
                  <td style={{ verticalAlign: 'middle', paddingLeft: '20px' }}>
                    <Heading style={logo}>
                      EMPIRES <span style={propertyText}>PROPERTY</span>
                    </Heading>
                    <Text style={subtitle}>Luxury Serviced Stays</Text>
                  </td>
                </tr>
              </tbody>
            </table>
          </Section>

          {/* Tagline Bar */}
          <Section style={taglineBar}>
            <Text style={taglineText}>{actionText} Confirmed</Text>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Text style={greeting}>Hi {guestName},</Text>

            <Text style={paragraph}>
              Thank you for confirming your <strong style={highlight}>{actionText}</strong>.
            </Text>

            {/* New Check-in Time Card */}
            <Section style={timeCard}>
              <Text style={timeLabel}>{timeLabel}</Text>
              <Heading style={timeHeading}>{newTime}</Heading>
            </Section>

            {/* Payment Card */}
            <Section style={paymentCard}>
              <table style={paymentTable}>
                <tbody>
                  <tr>
                    <td style={paymentLabel}>{actionText} Fee</td>
                    <td style={paymentValue}>£{price}</td>
                  </tr>
                  <tr>
                    <td colSpan={2} style={paymentDivider}></td>
                  </tr>
                  <tr>
                    <td style={totalLabel}>Total Paid</td>
                    <td style={totalValue}>£{price}</td>
                  </tr>
                </tbody>
              </table>
            </Section>

            <Text style={instructionText}>
              Please use your standard access code to {isEarly ? 'enter' : 'leave'} at this new time.
            </Text>

            <Text style={paragraph}>
              We look forward to {isEarly ? 'welcoming you' : 'your next stay'}.
            </Text>

            <Text style={closing}>
              Warm regards,<br />
              <strong style={highlight}>The Empires Property Team</strong>
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              <Link href="https://empiresproperty.co.uk" style={footerLink}>
                empiresproperty.co.uk
              </Link>
            </Text>
            <Text style={footerSmall}>
              © 2026 Empires Property. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default StoreOrderConfirmation;

// Styles
const main = {
  backgroundColor: '#F5F2EF',
  fontFamily: "'Inter', Arial, sans-serif",
  WebkitFontSmoothing: 'antialiased' as const,
};

const container = {
  margin: '0 auto',
  padding: '40px 20px',
  maxWidth: '600px',
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  overflow: 'hidden',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
};

const header = {
  backgroundColor: '#1C1917',
  padding: '30px 40px',
};

const logo = {
  margin: '0',
  fontFamily: "'Bodoni Moda', Georgia, serif",
  fontSize: '32px',
  fontWeight: 400,
  color: '#F5F2EF',
  letterSpacing: '4px',
  lineHeight: '1.2',
};

const propertyText = {
  color: '#8B735B',
  fontStyle: 'italic' as const,
};

const subtitle = {
  margin: '4px 0 0',
  fontFamily: "'Inter', Arial, sans-serif",
  fontSize: '11px',
  fontWeight: 400,
  color: '#8B735B',
  letterSpacing: '2px',
  textTransform: 'uppercase' as const,
};

const taglineBar = {
  backgroundColor: '#8B735B',
  padding: '16px 40px',
  textAlign: 'center' as const,
};

const taglineText = {
  margin: '0',
  fontFamily: "'Inter', Arial, sans-serif",
  fontSize: '14px',
  fontWeight: 600,
  color: '#F5F2EF',
  letterSpacing: '2px',
  textTransform: 'uppercase' as const,
};

const content = {
  padding: '50px 40px',
};

const greeting = {
  margin: '0 0 24px',
  fontFamily: "'Inter', Arial, sans-serif",
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#292524',
};

const paragraph = {
  margin: '0 0 40px',
  fontFamily: "'Inter', Arial, sans-serif",
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#292524',
};

const highlight = {
  color: '#8B735B',
};

const timeCard = {
  backgroundColor: '#F5F2EF',
  borderRadius: '6px',
  padding: '40px',
  textAlign: 'center' as const,
  marginBottom: '32px',
};

const timeLabel = {
  margin: '0 0 12px',
  fontFamily: "'Inter', Arial, sans-serif",
  fontSize: '13px',
  fontWeight: 600,
  color: '#8B735B',
  letterSpacing: '2px',
  textTransform: 'uppercase' as const,
};

const timeHeading = {
  margin: '0',
  fontFamily: "'Bodoni Moda', Georgia, serif",
  fontSize: '56px',
  fontWeight: 400,
  color: '#1C1917',
  letterSpacing: '2px',
};

const paymentCard = {
  backgroundColor: '#1C1917',
  borderRadius: '6px',
  padding: '30px',
  marginBottom: '40px',
};

const paymentTable = {
  width: '100%',
  borderCollapse: 'collapse' as const,
};

const paymentLabel = {
  padding: '8px 0',
  fontFamily: "'Inter', Arial, sans-serif",
  fontSize: '14px',
  fontWeight: 500,
  color: '#E8E2DA',
};

const paymentValue = {
  padding: '8px 0',
  fontFamily: "'Inter', Arial, sans-serif",
  fontSize: '16px',
  fontWeight: 600,
  color: '#F5F2EF',
  textAlign: 'right' as const,
};

const paymentDivider = {
  borderBottom: '1px solid #8B735B',
  padding: '8px 0',
};

const totalLabel = {
  padding: '12px 0 0',
  fontFamily: "'Inter', Arial, sans-serif",
  fontSize: '15px',
  fontWeight: 600,
  color: '#8B735B',
  textTransform: 'uppercase' as const,
  letterSpacing: '1px',
};

const totalValue = {
  padding: '12px 0 0',
  fontFamily: "'Bodoni Moda', Georgia, serif",
  fontSize: '24px',
  fontWeight: 400,
  color: '#8B735B',
  textAlign: 'right' as const,
};

const instructionText = {
  margin: '0 0 16px',
  fontFamily: "'Inter', Arial, sans-serif",
  fontSize: '15px',
  lineHeight: '1.6',
  color: '#292524',
};

const closing = {
  margin: '24px 0 0',
  fontFamily: "'Inter', Arial, sans-serif",
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#292524',
};

const footer = {
  backgroundColor: '#F5F2EF',
  padding: '30px 40px',
  textAlign: 'center' as const,
  borderTop: '1px solid #E8E2DA',
};

const footerText = {
  margin: '0 0 12px',
  fontFamily: "'Inter', Arial, sans-serif",
  fontSize: '13px',
  color: '#8B735B',
  lineHeight: '1.6',
};

const footerLink = {
  color: '#8B735B',
  textDecoration: 'none',
  fontWeight: 600,
};

const footerSmall = {
  margin: '0',
  fontFamily: "'Inter', Arial, sans-serif",
  fontSize: '12px',
  color: '#8B735B',
  lineHeight: '1.6',
};
