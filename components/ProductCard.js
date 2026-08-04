const stylesheetUrl = new URL('./ProductCard.css', import.meta.url);

function formatPrice(price, currency) {
  return new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency,
    maximumFractionDigits: Number.isInteger(price) ? 0 : 2,
  }).format(price);
}

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function getButtonText(outOfStock, hasCheckout) {
  if (outOfStock) return 'Slut i lager';
  if (hasCheckout) return 'Köp';
  return 'Snart tillgänglig';
}

class ProductCard extends HTMLElement {
  set product(value) {
    this._product = value;
    this.render();
  }

  set checkoutUrl(value) {
    this._checkoutUrl = value;
    this.render();
  }

  connectedCallback() {
    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
    }
    this.render();
  }

  render() {
    if (!this.shadowRoot || !this._product) return;

    const product = this._product;
    const outOfStock = Boolean(product.outOfStock);
    const hasCheckout = typeof this._checkoutUrl === 'string' && this._checkoutUrl.startsWith('https://');
    const canBuy = hasCheckout && !outOfStock;
    const formattedPrice = formatPrice(product.price, product.currency);
    const buttonText = getButtonText(outOfStock, hasCheckout);
    const button = canBuy
      ? `<a class="product-card__button" href="${escapeHtml(this._checkoutUrl)}" target="_blank" rel="noopener noreferrer" aria-label="Köp ${escapeHtml(product.title)} för ${escapeHtml(formattedPrice)} (öppnas i ny flik)">
          ${buttonText}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </a>`
      : `<span class="product-card__button product-card__button--disabled" aria-disabled="true">${buttonText}</span>`;

    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="${stylesheetUrl.href}">
      <article class="product-card${outOfStock ? ' product-card--out-of-stock' : ''}">
        <div class="product-card__media">
          <img class="product-card__image" src="${escapeHtml(product.image)}" alt="${escapeHtml(product.imageAlt || product.title)}" loading="lazy" width="1200" height="900">
          ${product.badge ? `<span class="product-card__badge">${escapeHtml(product.badge)}</span>` : ''}
        </div>
        <div class="product-card__body">
          <h2 class="product-card__title">${escapeHtml(product.title)}</h2>
          <p class="product-card__description">${escapeHtml(product.description)}</p>
          <div class="product-card__footer">
            <span class="product-card__price">${escapeHtml(formattedPrice)}</span>
            ${button}
          </div>
        </div>
      </article>
    `;
  }
}

customElements.define('product-card', ProductCard);
