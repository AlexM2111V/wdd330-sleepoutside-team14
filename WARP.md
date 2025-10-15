# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

SleepOutside is an e-commerce web application for outdoor gear (tents, sleeping bags, backpacks) built as part of WDD 330 - Web Frontend Development II coursework. The project follows a modular JavaScript architecture with Vite as the build tool.

## Common Commands

### Development
- `npm run start` - Start development server with Vite (auto-reloads on changes)
- `npm run build` - Build production files for deployment
- `npm run preview` - Preview the production build locally

### Code Quality
- `npm run lint` - Run ESLint to check for code errors and style issues
- `npm run format` - Format code with Prettier
- `npm run test` - Run Jest tests (currently minimal test coverage)

### Environment Setup
- Requires Node.js installed
- Uses Vite for development server and build process
- Environment variables should be prefixed with `VITE_` (e.g., `VITE_SERVER_URL`)

## Architecture

### Module System
The project uses ES6 modules (.mjs files) for core functionality:

- **ExternalServices.mjs** - API service layer for backend communication
- **ProductList.mjs** - Product listing and display logic
- **ProductDetails.mjs** - Individual product page functionality  
- **CheckoutProcess.mjs** - Shopping cart and checkout workflow
- **utils.mjs** - Shared utilities (DOM helpers, localStorage, templating)

### Key Patterns
- **Template-based rendering**: Uses `renderListWithTemplate()` and `renderWithTemplate()` from utils.mjs
- **Class-based components**: Major features implemented as ES6 classes (ProductList, CheckoutProcess, etc.)
- **LocalStorage persistence**: Cart data persisted via `getLocalStorage()`/`setLocalStorage()` utilities
- **Partial templates**: Header/footer loaded from `/partials/` directory

### File Structure
```
src/
├── js/                    # Core JavaScript modules
├── css/                   # Stylesheets
├── public/
│   ├── images/           # Product and UI images
│   ├── json/             # Static product data (fallback)
│   └── partials/         # Reusable HTML templates
├── cart/                 # Shopping cart page
├── checkout/             # Checkout and success pages
├── product_pages/        # Product detail pages
└── product_listing/      # Category listing pages
```

### Build Configuration
- **Vite config**: Root set to `src/`, builds to `../dist`
- **Multi-page app**: Separate entry points for main, cart, checkout, product pages
- **Development**: Serves from `src/` with auto-reload
- **Production**: Optimized bundle with code splitting

### API Integration
- Base URL configured via `VITE_SERVER_URL` environment variable
- REST endpoints: `/products/search/{category}`, `/product/{id}`, `/checkout/`
- Error handling via `convertToJson()` helper with structured error responses

### Cart & Checkout Flow
1. Products added to cart stored in localStorage as `so-cart`
2. CheckoutProcess class handles calculation (items, tax, shipping)
3. Form data converted to JSON and submitted via ExternalServices
4. Success redirects to `/checkout/success.html`

## Development Notes

### Code Style
- ES6+ features throughout (classes, arrow functions, template literals)
- Double quotes for strings (ESLint enforced)
- Prettier formatting with default configuration
- Import/export modules instead of script tags

### Testing
- Jest configured but minimal test coverage currently
- Test files should go in `src/test/` directory
- Run `npm run test` to execute test suite

### Deployment
- Production site hosted on Netlify: https://comforting-sawine-e8ec24.netlify.app/
- Run `npm run build` before deployment
- Vite handles asset optimization and bundling