# Semester-Project-2 – Auction House

<img src="public/images/Website-Design -AH.png">

A functional auction platform where users can buy and sell items using a credit-based system. New users receive 1,000 credits upon registration, which they can use to bid on items. Additional credits are earned by selling items.

## Features

- **User Registration & Authentication**  
  New users receive 1,000 credits automatically upon signing up.

- **Auction Listings**  
  Both guests and logged-in users can browse available listings.

- **Bidding System**  
  Only registered users can place bids on active items.

- **Credit System**  
  Earn credits by selling items and spend credits by bidding on auctions.

## Tech Stack

- **Design:** [Figma Wireframe & Prototype](https://www.figma.com/design/AX1ZyCJTAK4SBQInwqgZ6N/Semester-Project-2---Auction-Site?node-id=0-1&t=zdShkMUShuaRUpCk-1)
- **CSS Framework:** [Tailwind CSS v4.0](https://tailwindcss.com/docs/installation/tailwind-cli)
- **Frontend Build Tool:** [Vite](https://vite.dev/) 

## API

This project uses the [Noroff Auction API (v2)](https://docs.noroff.dev/docs/v2/auction-house/listings) as the backend for:
- User Authentication & Registration
- Auction Listings (Create, Read, Update, Delete)
- Bidding System

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/sandernilsen/semester-project-2-auctionhouse.git
cd semester-project-2-auctionhouse
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
Create a .env file in the root directory and add your Noroff API key:
```env
VITE_API_KEY=your-noroff-api-key
```

### 4. Run the Development Server
This runs Vite and Tailwind CSS in parallel:
```bash
npm run dev
```
Visit http://localhost:3000 to view the app.

### 5. Build for Production
```bash
npm run build
```
To preview the production build:
```bash
npm run preview
```

## Deployment
This project is deployed to [Netlify](https://semester-project-2-auctionhouse.netlify.app/index.html). The build settings are:
- **Build Command:** npm run build
- **Publish Directory:** dist

**Note:** Make sure your Netlify environment variable VITE_API_KEY is set in the dashboard.

## Testing Instructions

### 1. Run Unit Tests (Vitest)

This project uses Vitest and jsdom for unit testing.

Run all unit tests:
```bash
npm run test
```

Run tests in watch mode:
```bash
npm run test:watch
```

### 2. Run E2E Tests (Playwright)

This project uses Playwright for end-to-end browser testing.

Run E2E tests:
```bash
npm run test:e2e
```

To open the last generated HTML test report:
```bash
npx playwright show-report
```