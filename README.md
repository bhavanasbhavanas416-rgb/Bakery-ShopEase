# Crème & Crumb

A responsive, demo-only bakery storefront built with React, Vite, React Router,
Framer Motion, and Lucide React. Browse the sample catalog, save favourites,
build a custom cake request, and walk through a local checkout experience.

## Run locally

```sh
npm install
npm run dev
```

Vite prints the local URL in the terminal (normally <http://localhost:5173>).
Create a production build with `npm run build`.

## Demo behaviour

- Cart and wishlist persist in this browser's local storage.
- `SWEET10` applies a 10% sample discount; `FREESHIP` removes the delivery fee.
- Newsletter, contact, custom cake, and checkout interactions are local demos.
- Checkout never requests payment-card details and does not submit a real order.
- Product, ingredient, allergy, review, and pricing details are sample content.
- Food photography is loaded from Unsplash; an internet connection is needed.

The pre-existing Flutter package metadata is retained, but the storefront
requested for this workspace is the React/Vite application.
