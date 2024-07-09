import { plaidClient } from '@/lib/plaid';
import { NextRequest, NextResponse } from 'next/server';
import { CountryCode, Products } from 'plaid';

export async function GET(req: NextRequest, res: NextResponse) {
  // const tokenResponse = await plaidClient.linkTokenCreate({
  //   user: { client_user_id: process.env.PLAID_CLIENT_ID! },
  //   client_name: "Easy Budget",
  //   language: 'en',
  //   products: ['transactions'] as Products[],
  //   country_codes: ['US'] as CountryCode[],
  // });

  // return NextResponse.json(tokenResponse.data);
  return NextResponse.json({ message: 'Hello, World!' });
}
