# Deploying Flabo to Vercel

This guide will help you deploy your Flabo project to Vercel with Supabase integration.

## Prerequisites

1. A [Vercel account](https://vercel.com/signup) (you can sign up with your GitHub account)
2. Your GitHub repository: https://github.com/jesusvaros/Flabo.git
3. Supabase project credentials

## Environment Variables

You'll need to set up the following environment variables in Vercel:

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" > "Project"
3. Import your GitHub repository (jesusvaros/Flabo)
4. Configure the project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: next build
   - Output Directory: .next
5. Add the environment variables:
   - Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Click "Deploy"

### Option 2: Deploy via Vercel CLI

1. Login to Vercel CLI:
   ```
   npx vercel login
   ```

2. Deploy the project:
   ```
   npx vercel
   ```

3. Follow the prompts:
   - Set up and deploy "~/Flabo"? Yes
   - Link to existing project? No
   - What's your project's name? flabo
   - In which directory is your code located? ./
   - Want to override the settings? No
   - Add Environment Variables? Yes
     - Add `NEXT_PUBLIC_SUPABASE_URL`
     - Add `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Setting Up Automatic Deployments

Automatic deployments are enabled by default when you connect your GitHub repository to Vercel. Each time you push to your repository, Vercel will automatically deploy the changes.

## Performance Optimization

The `vercel.json` file in your project already includes configurations for:
- Optimized caching for static assets
- Security headers
- Region selection for faster load times

## Additional Optimizations

1. **Image Optimization**: Vercel automatically optimizes images with Next.js Image component.

2. **Edge Caching**: Vercel automatically caches your content at the edge.

3. **Analytics**: Enable Vercel Analytics in your project settings to monitor performance.

## Troubleshooting

If you encounter any issues during deployment:

1. Check the build logs in Vercel dashboard
2. Verify that all environment variables are correctly set
3. Ensure your Supabase project is properly configured and accessible

## Next Steps After Deployment

1. Set up a custom domain in Vercel dashboard
2. Configure SSL certificates (automatically handled by Vercel)
3. Set up monitoring and alerts
4. Consider adding Vercel Analytics for performance monitoring
