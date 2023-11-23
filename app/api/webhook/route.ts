
import { NextResponse } from "next/server";
import Stripe from 'stripe';
import supabaseClient from '@/utils/supabase-client'; // Added import for Supabase client


const supabase = supabaseClient;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15',
});

console.log('STRIPE_WEBHOOK_SECRET:', process.env.STRIPE_WEBHOOK_SECRET);


export async function POST(request: Request) {
  const body = await request.text();

  const sig = request.headers.get("Stripe-Signature");
  if (!sig) {
    console.log("No signature");
    return NextResponse.json({ error: "No signature" });
  }


  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.log(`Webhook signature verification failed.`, err.message);
    return NextResponse.json({ error: err });
  }

  console.log("received ", event.type);


  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      // console.log(`Session : ${JSON.stringify(session)}`);
      console.log(`Session metadata: ${JSON.stringify(session.metadata)}`);

      if (session.metadata) {
        const userId = session.metadata.userId;
        // console.log(`Extracted userId from metadata: ${userId}`);
        const { error: userError } = await supabase
          .from('users')
          .update({
            stripe_customer_id: session.customer
          })
          .eq('id', userId);

        if (userError) {
          console.error(`Error updating user: ${userError.message}`);
        } else {
          console.log(`Updated user ${userId} with Stripe customer ID ${session.customer}`);
        }
      }
      break;

    case 'customer.subscription.created':
    case 'customer.subscription.updated':
      const subscription = event.data.object as Stripe.Subscription;
      console.log(subscription, 'subscription');
      const sub_id = subscription.id
      const sub: any = subscription
      const qty = sub.quantity

      const priceId = subscription.items.data[0].price.id;
      // console.log(priceId, 'priceId');
      // console.log(sub_id, qty);
      // console.log(subscription.customer);
      

      let subscription_status = 'inactive';
         if (priceId === 'price_1NspNqCZJfZkzempbPSSLCjI' || priceId === 'price_1NspNqCZJfZkzempzGIl4YaI') {
         subscription_status = 'pro';
       }

      // if (priceId === 'price_1NbudwCZJfZkzempT2priYqA' || priceId === 'price_1NbudwCZJfZkzemp5Xw5ajIy') {
      //   subscription_status = 'pro';
      // }

      const { error: subscriptionError } = await supabase
        .from('users')
        .update({
          subscription_status: subscription_status,
          price_id: priceId,
          sub_id: sub_id,
          qty: qty,
          current_period_start: new Date(subscription.current_period_start * 1000),
          current_period_end: new Date(subscription.current_period_end * 1000)
        })
        .eq('stripe_customer_id', subscription.customer);

      if (subscriptionError) {
        console.error(`Error updating subscription: ${subscriptionError.message}`);
      } else {
        console.log(`Updated user with Stripe customer ID ${subscription.customer} with status ${subscription_status}`);
      }
      break;

    case 'customer.subscription.deleted':
      const deletedSubscription = event.data.object as Stripe.Subscription;
      console.log(`Subscription ${deletedSubscription.id} has been deleted`);

      const { error: deleteSubscriptionError } = await supabase
        .from('users')
        .update({
          subscription_status: 'inactive',
        })
        .eq('stripe_customer_id', deletedSubscription.customer);

      if (deleteSubscriptionError) {
        console.error(`Error updating subscription status after deletion: ${deleteSubscriptionError.message}`);
      } else {
        console.log(`Updated subscription status to 'inactive' for user with Stripe customer ID ${deletedSubscription.customer}`);
      }
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  return NextResponse.json({ received: true });



}