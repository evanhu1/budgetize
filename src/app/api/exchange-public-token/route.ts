import { NextRequest, NextResponse } from 'next/server';
import { plaidClient, sessionOptions } from '@/lib/plaid';

export async function POST(req: NextRequest, res: NextResponse) {
  const publicToken = (await req.json()).public_token;
  try {
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });
    const accessToken = response.data.access_token;
    const itemID = response.data.item_id;
    return NextResponse.json({ public_token_exchange: 'complete', accessToken, itemID });
  } catch (error) {
    // handle error
    console.error(error);
    return NextResponse.json({ public_token_exchange: 'error' });
  }
}
