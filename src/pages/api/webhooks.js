import getRawBody from "raw-body";
import { stripe } from "src/pricing/utils/stripe";
import { supabase } from "supabase";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const signature = req.headers["stripe-signature"];
  const signingSecret = process.env.STRIPE_SIGNING_SECRET;
  //  raw buffer

  let event;
  try {
    const RawBody = await getRawBody(req, { limit: "2mb" });
    event = stripe.webhooks.constructEvent(RawBody, signature, signingSecret);
  } catch (e) {
    return res.status(400).end();
  }

  try {
    switch (event.type) {
      case "customer.subscription.updated":
        await updateSubscription(event);
        break;
      case "customer.subscription.deleted":
        await deleteSubscription(event);
        break;
    }
    res.send({ success: true });
  } catch (e) {
    res.send({ success: false });
  }
}

async function updateSubscription(event) {
  const subscription = event.data.object;
  const stripe_customer_id = subscription.customer;
  const subscription_status = subscription.status;
  const price = subscription.items.data[0].price;

  // if the user already has the profile update the subscription
  const { data: profile } = await supabase
    .from("profile")
    .select("*")
    .eq("stripe_customer_id", stripe_customer_id)
    .single();


  if (profile) {
    const updatedSubscription = {
      subscription_status,
      price,
    };

    await supabase
      .from("profile")
      .update(updatedSubscription)
      .eq("stripe_customer_id", stripe_customer_id);
  }
  // else if user do not have the subscription create a new user
  else {
    const customer = await stripe.customers.retrieve(stripe_customer_id);
    const { name, email } = customer;

    const newProfile = {
      name,
      email,
      stripe_customer_id,
      subscription_status,
      price,
    };
    // create authentication
    const res = await supabase.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: newProfile,
    });
    // add user to the profile table if user is new
    const user = res.data.user;
    const { data, error } = await supabase
      .from("profile")
      .insert([
        {
          user_id: user.id,
          email,
          name,
          stripe_customer_id,
          subscription_status,
          price,
        },
      ])
      .select();
  }
}

async function deleteSubscription(event) {

  const subscription = event.data.object;
  const stripe_customer_id = subscription.customer;
  const subscription_status = subscription.status;

  const deletedSubscription =  {
    subscription_status,
    price: null
  }

  const { data: profile } = await supabase
  .from("profile")
  .update(deletedSubscription)
  .eq("stripe_customer_id", stripe_customer_id)
  

}
