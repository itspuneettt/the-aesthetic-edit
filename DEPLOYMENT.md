# 🚀 Deployment Guide

## Deploy to Railway (Free Tier Available)

Railway is the easiest way to deploy this full-stack app with a database. Follow these steps:

### Step 1: Sign Up for Railway

1. Go to [railway.app](https://railway.app)
2. Sign up with your GitHub account (free)
3. You get $5 free credit per month (enough for this app!)

### Step 2: Deploy from GitHub

1. Click **"New Project"** in Railway dashboard
2. Select **"Deploy from GitHub repo"**
3. Choose `itspuneettt/the-aesthetic-edit`
4. Railway will automatically detect the configuration

### Step 3: Add MySQL Database

1. In your Railway project, click **"+ New"**
2. Select **"Database"** → **"Add MySQL"**
3. Railway will automatically create a database and set `DATABASE_URL`

### Step 4: Set Environment Variables

Click on your service → **"Variables"** tab and add:

```
NODE_ENV=production
PORT=3000
```

**For LLM Integration (Required for chatbot to work):**

You have two options:

#### Option A: Use OpenAI (Recommended)
```
BUILT_IN_FORGE_API_URL=https://api.openai.com/v1
BUILT_IN_FORGE_API_KEY=sk-your-openai-api-key
```
Get your API key at: https://platform.openai.com/api-keys

#### Option B: Use Anthropic Claude
```
BUILT_IN_FORGE_API_URL=https://api.anthropic.com/v1
BUILT_IN_FORGE_API_KEY=sk-ant-your-anthropic-api-key
```
Get your API key at: https://console.anthropic.com/

**Other Required Variables:**
```
JWT_SECRET=your-random-secret-string-here
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
```

### Step 5: Deploy!

1. Click **"Deploy"** 
2. Wait 2-3 minutes for build to complete
3. Railway will give you a public URL like: `your-app.up.railway.app`
4. Share this URL with your friends!

### Step 6: Run Database Migrations

After first deployment:
1. Go to your service → **"Settings"** → **"Deploy Triggers"**
2. Click **"Deploy"** to restart
3. Or run migrations manually in the Railway terminal:
```bash
pnpm db:push
```

---

## 💰 Cost Breakdown

**Railway Free Tier:**
- $5 free credit per month
- This app uses ~$3-4/month (well within free tier!)
- No credit card required to start

**OpenAI API Costs:**
- ~$0.002 per chatbot message
- 100 messages = $0.20
- Very affordable for personal use

---

## 🔧 Troubleshooting

### Build fails with "command not found"
- Make sure `railway.json` and `nixpacks.toml` are in the root directory

### Database connection error
- Check that `DATABASE_URL` is set automatically by Railway's MySQL service
- Make sure you added the MySQL database to your project

### Chatbot not responding
- Verify `BUILT_IN_FORGE_API_KEY` and `BUILT_IN_FORGE_API_URL` are set correctly
- Check that your OpenAI/Anthropic API key is valid

### App crashes on startup
- Check the logs in Railway dashboard
- Make sure all environment variables are set
- Verify `PORT` is set to `3000`

---

## 🎉 Success!

Once deployed, your app will be live at: `https://your-app.up.railway.app`

Share this link with your friends and they can start using the chatbot immediately!

---

## Alternative: Deploy to Render

If Railway doesn't work, you can also deploy to [Render](https://render.com) (also has free tier):

1. Sign up at render.com
2. Create new **"Web Service"**
3. Connect your GitHub repo
4. Add MySQL database (free tier available)
5. Set the same environment variables as above
6. Deploy!

Render gives you a URL like: `your-app.onrender.com`
