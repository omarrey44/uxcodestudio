import Stripe from "stripe";

let _stripe: Stripe | undefined;

/** Lazily instantiated so a missing STRIPE_SECRET_KEY only breaks Stripe-dependent
 *  requests at runtime — not the entire production build. */
export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  }
  return _stripe;
}
