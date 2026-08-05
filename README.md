# Svågrarna.se

Webbplatsen är helt statisk och kan publiceras direkt på GitHub Pages. Tillbehörsbutiken använder Stripe Payment Links: webbplatsen visar produkterna, medan Stripe hanterar betalning, kunduppgifter och kvitto.

## Styling

Gemensamma färger, grundstilar, header, kontaktknapp och footer finns i `styles/site.css`. Sidunika regler ligger kvar i respektive HTML-fil. Produktkortets inkapslade komponentstil finns i `components/ProductCard.css`.

## Lägg till en produkt

### 1. Skapa produkten i Stripe

1. Logga in i [Stripe Dashboard](https://dashboard.stripe.com/).
2. Gå till **Product catalog** och välj **Add product**.
3. Ange produktnamn, pris och eventuell information som ska visas i Stripes kassa.
4. Spara produkten.

Kontrollera om du arbetar i testläge eller skarpt läge. En Payment Link som skapats i testläge tar inte emot riktiga betalningar.

### 2. Skapa en Payment Link

1. Öppna produkten i Stripe och välj **Create payment link**.
2. Konfigurera länken för avhämtning och se till att ingen frakt erbjuds. Alla beställningar hämtas på Degerholmens brygga.
3. Aktivera länken och kopiera adressen som börjar med `https://buy.stripe.com/`.

Varje produkt köps separat. Webbplatsen har därför ingen varukorg eller egen kassalogik.

### 3. Lägg till produktinformationen

Lägg till ett objekt i [`data/products.json`](data/products.json):

```json
{
  "id": "heating-element",
  "title": "Värmeelement",
  "description": "Originalelement till Cinderella.",
  "price": 1295,
  "currency": "SEK",
  "image": "/images/products/heating-element.webp",
  "imageAlt": "Värmeelement till Cinderella",
  "badge": "Populär",
  "outOfStock": false
}
```

`id` måste vara unikt. `badge` och `outOfStock` är valfria. Priset anges som ett vanligt tal i den valda valutan, exempelvis `560` för 560 SEK.

### 4. Klistra in Payment Link

Lägg till samma produkt-id och länken i [`data/stripe-links.json`](data/stripe-links.json):

```json
{
  "bowl-liners-500": "https://buy.stripe.com/din-befintliga-lank",
  "heating-element": "https://buy.stripe.com/din-nya-lank"
}
```

Produktdata och betalningsleverantör hålls separerade. `data/payment-config.js` är adaptern mellan länkkonfigurationen och sidan. Om betalningsleverantören byts i framtiden behöver produktkatalogen, sidan och produktkortet inte göras om; byt implementationen i den adaptern.

## Produktbilder

Lägg bilder i `images/products/`. Rekommenderad storlek är **1200 × 900 pixlar** (4:3), helst som WebP för liten filstorlek. Sikta på högst cirka 200 kB per bild och använd en lugn, ljus bakgrund. Ange en kort och beskrivande `imageAlt` för tillgänglighet.

## Markera som slut i lager

Sätt `outOfStock` till `true` i `data/products.json`:

```json
"outOfStock": true
```

Produktkortet ligger kvar men köpknappen ersätts med **Slut i lager**. För ett längre stopp rekommenderas också att Payment Link inaktiveras i Stripe.

## Lokal förhandsvisning

JSON-filer kan inte läsas korrekt om HTML-filen öppnas direkt med `file://`. Starta i stället en enkel lokal webbserver från projektroten, till exempel:

```sh
python3 -m http.server 8000
```

Öppna sedan `http://localhost:8000/pages/reservdelar.html`.
