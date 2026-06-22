# NSLA CarShip - Carrier Management System

A professional carrier/driver database system with intelligent route matching for NSLA CarShip LLC.

## Features

✅ **Carrier Database** — Add and manage verified carriers with detailed information
✅ **DOT & FMCSA Verification** — Track verification status and insurance expiry
✅ **Route Matching** — Find carriers by pickup/dropoff location
✅ **Order History** — Log previous shipments to learn carrier routes
✅ **CSV Export** — Download all carrier data anytime
✅ **Persistent Storage** — All data saves automatically in your browser

## Quick Start (Local Development)

### Prerequisites
- Node.js 16+ installed on your computer

### Installation

1. Download the files (or clone the repo if using GitHub)

2. Open terminal/command prompt in the project folder

3. Install dependencies:
```bash
npm install
```

4. Start the development server:
```bash
npm run dev
```

5. Open browser and go to: `http://localhost:3000`

## Deploy to Vercel (FREE)

### Option A: Using GitHub (Recommended)

1. **Create GitHub Account** (if you don't have one)
   - Go to https://github.com/signup
   - Create free account

2. **Create a New Repository**
   - Go to https://github.com/new
   - Name it: `nsla-carrier-system`
   - Click "Create repository"

3. **Upload Files to GitHub**
   - On the GitHub page, click "uploading an existing file"
   - Drag and drop all your project files
   - Commit the files

4. **Connect to Vercel**
   - Go to https://vercel.com
   - Click "Sign Up" → Choose "Continue with GitHub"
   - Authorize Vercel to access your GitHub
   - Click "Import Project"
   - Select your `nsla-carrier-system` repository
   - Click "Import"
   - Vercel will auto-detect it's a Next.js project
   - Click "Deploy"

5. **Done!** 🎉
   - Vercel will give you a live URL like: `https://nsla-carrier-system.vercel.app`
   - Share this URL with your team
   - Your system is live!

### Option B: Using Vercel CLI (Advanced)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow the prompts and Vercel will give you a live URL

## Usage

### Dashboard
Quick overview of your carrier statistics

### Add Carrier
1. Enter company name & DOT number
2. Add insurance expiry date
3. Check "MC Active" and "FMCSA Verified" if applicable
4. Add service areas (pickup/dropoff locations)
5. Click "Save Carrier"

### Find Driver
1. Enter a pickup location (e.g., "Brooklyn, NY")
2. Enter a dropoff location (e.g., "Miami, FL")
3. System shows all carriers who service that route
4. Data comes from both their service areas AND order history

### Directory
- View all carriers
- Search by company name or DOT number
- Add previous orders (the system learns from these)
- Delete carriers if needed
- Export all data as CSV

## Data Storage

All your carrier data is stored in your browser's local storage. This means:
- ✅ Data persists between sessions
- ✅ No server needed
- ✅ Your data stays with you
- ✅ Download CSV backup anytime

## Troubleshooting

**"I lost my data!"**
- Local storage can be cleared if you delete browser cache. Download a CSV backup regularly!

**"Can't find a carrier I just added?"**
- Make sure to add service areas or previous orders for the route matching to work

**"Deployment failed?"**
- Make sure all files are included (package.json, next.config.js, pages/index.js)
- Check that GitHub repo is set to public

## Support

For questions about using this system, feel free to reach out to your development team.

---

**Version:** 1.0.0  
**Built for:** NSLA CarShip LLC  
**Last Updated:** 2024
