
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
  productName: string;
  productId: string;
  selectedTime: string;  // '2:15 PM' for hourly, '' for fixed
  price: string;         // '35.00'
  propertyId?: string;
}

export const StoreOrderConfirmation = ({
  guestName = 'Guest',
  productName = 'Early Check-in',
  productId = 'early-checkin',
  selectedTime = '3:00 PM',
  price = '20.00',
  propertyId = 'haven',
}: StoreOrderConfirmationProps) => {

  const isEarlyCheckin = productId === 'early-checkin';
  const isLateCheckout = productId === 'late-checkout';
  const isBagDrop = productId === 'bag-drop';
  const isLeaveBags = productId === 'leave-bags';
  const isHourly = isEarlyCheckin || isLateCheckout;

  const getActionText = () => {
    if (isEarlyCheckin) return 'Early Check-in';
    if (isLateCheckout) return 'Late Check-out';
    if (isBagDrop) return 'Bag Drop';
    if (isLeaveBags) return 'Bag Storage';
    return productName;
  };

  const actionText = getActionText();

  const getTimeLabelText = () => {
    if (isEarlyCheckin) return 'New Check-in Time';
    if (isLateCheckout) return 'New Check-out Time';
    return '';
  };

  const getInstructionText = () => {
    if (isEarlyCheckin) return 'Please use your standard access code to enter at this new time.';
    if (isLateCheckout) return 'Please use your standard access code to leave at this new time.';
    if (isBagDrop) return 'You may drop your bags off from 2:00 PM. Please use your standard access code.';
    if (isLeaveBags) return 'You may leave your bags at the property after your 11:00 AM check-out. Please collect them at your convenience.';
    return '';
  };

  // Determine base URL based on property
  const getBaseUrl = (pid: string) => {
    if (pid === 'vibe') return 'https://vibe.empiresproperty.co.uk';
    return 'https://haven.empiresproperty.co.uk';
  };
  const baseUrl = getBaseUrl(propertyId);

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
      <Preview>Your {actionText.toLowerCase()} is confirmed{isHourly && selectedTime ? ` at ${selectedTime}` : ''} - Empires Property</Preview>
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
            <Text style={taglineTextStyle}>{actionText} Confirmed</Text>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Text style={greeting}>Hi {guestName},</Text>

            <Text style={paragraph}>
              Thank you for confirming your <strong style={highlight}>{actionText}</strong>.
            </Text>

            {/* New Time Card — only for hourly products */}
            {isHourly && selectedTime && (
              <Section style={timeCard}>
                <Text style={timeLabelStyle}>{getTimeLabelText()}</Text>
                <Heading style={timeHeading}>{selectedTime}</Heading>
              </Section>
            )}

            {/* Info Card — for bag drop / leave bags */}
            {isBagDrop && (
              <Section style={timeCard}>
                <Text style={timeLabelStyle}>Bag Drop Available From</Text>
                <Heading style={timeHeading}>2:00 PM</Heading>
              </Section>
            )}

            {isLeaveBags && (
              <Section style={timeCard}>
                <Text style={timeLabelStyle}>Leave Bags After</Text>
                <Heading style={timeHeading}>11:00 AM</Heading>
              </Section>
            )}

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

            <Text style={instructionTextStyle}>
              {getInstructionText()}
            </Text>

            <Text style={paragraph}>
              We look forward to {isEarlyCheckin || isBagDrop ? 'welcoming you' : 'your next stay'}.
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

const taglineTextStyle = {
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

const timeLabelStyle = {
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
  fontSize: '48px',
  fontWeight: 400,
  color: '#1C1917',
  letterSpacing: '2px',
  whiteSpace: 'nowrap' as const,
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

const instructionTextStyle = {
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
