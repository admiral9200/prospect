import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15',
});

if (!process.env.STRIPE_SECRET_KEY) {
  console.log({ error: 'userId and priceId are required' })
}

console.log(process.env.STRIPE_SECRET_KEY)

export const POST = async (req: NextRequest, res: NextResponse) => {
  try {
    const body = await req.json()
    const qty = body.qty
    const sub_id = body.sub_id
    const price_id = body.price_id

    const stripe_sub_id = sub_id

    const subscription = await stripe.subscriptions.retrieve(
      stripe_sub_id
    );
    // console.log(JSON.stringify(subscription));


    let IdOfPriceToUpdate = price_id;
    let newQuantity = qty;

    let updatedItemParams = subscription.items.data.
      filter((item: any) => item.price != IdOfPriceToUpdate). // find what to change
      map(item => { return { id: item.id, quantity: newQuantity } }) // change it

    console.log(updatedItemParams);


    const res = await stripe.subscriptions.update(
      stripe_sub_id,
      { items: updatedItemParams }
    )
    // console.log(res);


    return NextResponse.json({ message: 'Subscription is updated sucessfully' })

  } catch (err: any) {
    console.log({ error: err.message });
    return NextResponse.json({ error: err.message }, {
      status: 500
    })
  }
};
