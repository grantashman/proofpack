export const pilotOffer = Object.freeze({
  name: 'Founding cleaner pilot',
  price: Object.freeze({
    amount: 39,
    currency: 'AUD',
    interval: 'month',
    gstInclusive: true,
  }),
  trialDays: 14,
  activeSites: 5,
  reportLimit: null,
  lockIn: false,
  features: Object.freeze([
    'Unlimited branded proof-of-service reports',
    'Five active client sites',
    'Before-and-after photo evidence',
    'Issue flags and follow-up notes',
    'Client-ready PDF and client share link',
    'Australian date, address and GST conventions',
  ]),
});

export function formatPilotPrice(offer = pilotOffer) {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: offer.price.currency,
    maximumFractionDigits: 0,
  }).format(offer.price.amount);
}
