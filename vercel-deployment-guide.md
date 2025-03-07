# Vercel Deployment Guide for Flabo

## Environment Variables Setup

The build is failing because Vercel needs the following environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Steps to Deploy Successfully

1. Go to the [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project (flabo)
3. Click on "Settings" tab
4. Navigate to "Environment Variables" section
5. Add the following environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
6. Click "Save"
7. Go to the "Deployments" tab
8. Find your latest deployment and click on the three dots (...)
9. Select "Redeploy" to deploy with the new environment variables

## Finding Your Supabase Credentials

1. Log in to your [Supabase Dashboard](https://app.supabase.io/)
2. Select your project
3. Go to "Project Settings" > "API"
4. You'll find:
   - Project URL: Use this for `NEXT_PUBLIC_SUPABASE_URL`
   - anon public: Use this for `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Verifying the Deployment

After redeploying, check the build logs to ensure there are no more errors. Your application should be accessible at the URL provided by Vercel.

## Setting Up Automatic Deployments

Automatic deployments are enabled by default when you connect your GitHub repository to Vercel. Each time you push to your repository, Vercel will automatically deploy the changes.

## Performance Optimizations

The `vercel.json` file in your project includes configurations for:
- Optimized caching for static assets
- Security headers
- Region selection for faster load times

## Troubleshooting Common Issues

1. **Build Failures**: Check the build logs for specific error messages
2. **Missing Environment Variables**: Ensure all required environment variables are set
3. **Case Sensitivity Issues**: Windows is case-insensitive but Vercel's Linux servers are case-sensitive, so ensure all import paths use the correct case
