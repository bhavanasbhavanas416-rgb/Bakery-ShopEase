# Crème & Crumb — Bakery ShopEase

A responsive bakery storefront demo for browsing cakes, pastries, cupcakes, and
other treats. Explore the catalog, save favourites, build a custom cake request,
and try a local checkout flow.

**GitHub:** [Bakery-ShopEase](https://github.com/bhavanasbhavanas416-rgb/Bakery-ShopEase)

## Features

- Browse a sample bakery catalog by category and product.
- Search for products and view product details.
- Add products to a cart and save favourites to a wishlist.
- Configure a custom cake request.
- Try the checkout and order confirmation demo.
- Visit the about, contact, delivery, privacy, and terms pages.
- Keep cart and wishlist contents in browser local storage.
- Use a responsive layout on desktop and mobile screens.

## Tech stack

- React 19
- Vite
- React Router
- Framer Motion
- Lucide React
- CSS

## Getting started

### Prerequisites

- Node.js and npm

### Install and run

```sh
npm install
npm run dev
```

Open the local URL printed by Vite, usually <http://localhost:5173>.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local development server. |
| `npm run build` | Create a production build in `dist/`. |
| `npm run preview` | Preview the production build locally. |

## Demo notes

- `SWEET10` applies a sample 10% discount; `FREESHIP` removes the sample
  delivery fee.
- Checkout is a local demonstration only: it does not process payments or
  submit real orders.
- Newsletter, contact, and custom cake interactions are demos, not connected to
  a backend.
- Products, prices, reviews, ingredients, and allergen information are sample
  content and should not be used to make real purchasing or dietary decisions.
- Product photos load from Unsplash, and Google Fonts load from Google Fonts;
  an internet connection is needed for these external assets.

## Project structure

```text
src/
  App.jsx          Routes and shared page layout
  components.jsx   Shared UI components
  data.js          Sample products, categories, and testimonials
  main.jsx         React application entry point
  pages.jsx        Storefront pages
  store.jsx        Cart, wishlist, and local storage state
  styles.css       Application styles
```

## License

No license has been specified for this project.
