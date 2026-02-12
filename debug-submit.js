
import fetch from 'node-fetch';

async function debugSubmit() {
    const payload = {
        reservationId: '698df032deb6216166e8a5b0', // Fatima Test
        guestName: 'Fatima Test',
        reasonForTrip: 'Business',
        agreedToRules: true,
        signatureImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        signatureDate: '2026-02-12'
    };

    console.log('Submitting check-in form...');

    try {
        const response = await fetch('https://haven.empiresproperty.co.uk/.netlify/functions/submit-checkin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        console.log('Status:', response.status);
        const text = await response.text();
        console.log('Body:', text);

    } catch (error) {
        console.error('Error:', error);
    }
}

debugSubmit();
