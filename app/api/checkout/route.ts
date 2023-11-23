import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import supabaseClient from '@/utils/supabase-client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15',
});

if (!process.env.STRIPE_SECRET_KEY) {
  console.log({ error: 'STRIPE_SECRET_KEY is required' })
}

console.log(process.env.STRIPE_SECRET_KEY)

export const POST = async (req: NextRequest, res: NextResponse) => {
  try {
    const { userId, priceId } = await req.json();

    if (!userId || !priceId) throw new Error("userId and priceId are required");

    const { data: userData, error: err } = await supabaseClient
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()
    if (err) throw err

    const { subscription_status } = userData
    if (subscription_status === 'pro') throw new Error("You already have subscription");

    const { data, error } = await supabaseClient
      .from('workspace')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) throw error

    const { members_detail } = data
    const total_qty = Object.keys(members_detail).length ?? 1
    // console.log(total_qty);
    
    if (total_qty < 1) throw new Error("qty cannot be less 1");

    console.log(`Creating session for user ${userId} with priceId ${priceId} qty ${total_qty}`);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: total_qty
        },
      ],
      mode: 'subscription',
      success_url: `https://prosp.ai/dashboard`,
      cancel_url: `https://prosp.ai/dashboard`,
      metadata: {
        userId: userId,
        currency: 'usd',
      },
    });
    // console.log(session);

    return NextResponse.json({ sessionId: session.id })

  } catch (err: any) {
    console.log(err);
    return NextResponse.json({ error: err.message }, {
      status: 500
    })
  }
};
