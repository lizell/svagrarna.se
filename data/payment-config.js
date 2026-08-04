const paymentLinksUrl = new URL('./stripe-links.json', import.meta.url);

export async function loadPaymentLinks() {
  const response = await fetch(paymentLinksUrl);

  if (!response.ok) {
    throw new Error('Payment configuration could not be loaded');
  }

  return response.json();
}
