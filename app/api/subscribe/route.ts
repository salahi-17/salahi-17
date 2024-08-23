import { NextResponse } from 'next/server';

const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
const MAILCHIMP_SERVER_PREFIX = process.env.MAILCHIMP_SERVER_PREFIX;
const MAILCHIMP_AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID;

if (!MAILCHIMP_API_KEY || !MAILCHIMP_SERVER_PREFIX || !MAILCHIMP_AUDIENCE_ID) {
  throw new Error('Missing Mailchimp configuration');
}

interface SubscribeRequestBody {
  email: string;
  firstName: string;
  lastName: string;
}

export async function POST(request: Request) {
  try {
    const body: SubscribeRequestBody = await request.json();
    const { email, firstName, lastName } = body;

    if (!email || !firstName || !lastName) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const data = {
      email_address: email,
      status: 'subscribed',
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName,
      },
    };

    const response = await fetch(
      `https://${MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${MAILCHIMP_AUDIENCE_ID}/members`,
      {
        method: 'POST',
        headers: {
          Authorization: `apikey ${MAILCHIMP_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.title || 'Error subscribing to the newsletter');
    }

    return NextResponse.json({ message: 'Successfully subscribed' }, { status: 201 });
  } catch (error) {
    console.error('Mailchimp API error:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Error subscribing to the newsletter' },
      { status: 500 }
    );
  }
}