# Deploying Flabo to Vercel

This guide will walk you through the process of deploying your Flabo project to Vercel with automatic deployments from GitHub.

## Prerequisites

- A GitHub account with your Flabo project repository
- A Vercel account (you can sign up at [vercel.com](https://vercel.com))
- A Supabase project (for backend functionality)

## Step 1: Prepare Your Project

Before deploying, make sure your project builds successfully locally:

```bash
npm run build
```

We've already fixed several issues that could prevent successful deployment:
- Fixed import path casing for the BackButton component
- Updated component props to match their interfaces
- Added error handling for Supabase client initialization
- Created a robust vercel.json configuration file

## Step 2: Connect to GitHub

1. Log in to your Vercel account
2. Click "Add New..." and select "Project"
3. Import your GitHub repository
4. Select the Flabo repository from the list

## Step 3: Configure Project Settings

1. Framework Preset: Select "Next.js"
2. Root Directory: Leave as default (/)
3. Build Command: `next build` (this should be automatically detected)
4. Output Directory: `.next` (this should be automatically detected)

## Step 4: Set Up Environment Variables (CRITICAL)

The build will fail without these environment variables. Add the following:

1. Click on "Environment Variables" section
2. Add the following variables:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key

You can find these values in your Supabase dashboard:
1. Log in to [app.supabase.io](https://app.supabase.io)
2. Select your project
3. Go to Project Settings > API
4. Copy the URL and anon key

## Step 5: Deploy

1. Click "Deploy"
2. Wait for the build and deployment process to complete
3. Once deployed, Vercel will provide you with a URL to access your application

## Automatic Deployments

Vercel automatically sets up continuous deployment from your GitHub repository. Any push to the main branch will trigger a new deployment.

## Troubleshooting Common Issues

### Build Failures

If your build fails, check the Vercel logs for specific error messages. Common issues include:

1. **Missing Environment Variables**: Ensure all required environment variables are set correctly
2. **Case Sensitivity Issues**: Windows is case-insensitive, but Vercel's Linux servers are case-sensitive. Ensure all import paths use the correct case.
3. **ESLint Errors**: You might see ESLint warnings, but they shouldn't prevent deployment

### Runtime Errors

If your application deploys but doesn't work correctly:

1. Check browser console for JavaScript errors
2. Verify that your Supabase connection is working
3. Check that your environment variables are correctly set and accessible

## Performance Optimizations

The `vercel.json` file includes configurations for:

- Optimized caching for static assets (fonts, images)
- Security headers for better protection
- Region selection for faster load times (currently set to Frankfurt - "fra1")
- Framework-specific optimizations for Next.js

## Monitoring and Analytics

After deployment, you can monitor your application's performance in the Vercel dashboard:

1. Analytics for page views and API routes
2. Performance metrics
3. Error tracking

## Custom Domains

To use a custom domain:

1. Go to your project in Vercel
2. Click on "Domains"
3. Add your custom domain and follow the verification steps

## Need Help?

If you encounter any issues during deployment, refer to:

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Supabase Documentation](https://supabase.com/docs)
