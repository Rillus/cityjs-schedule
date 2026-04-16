# Deployment Guide

This guide explains how to set up automatic deployment for your Glastonbury Festival app using GitHub Actions.

## 🚀 Deployment Options

You have two deployment workflows available:

1. **SSH Deployment** (Recommended) - `deploy.yml`
2. **FTP Deployment** (Alternative) - `deploy-ftp.yml`

## 📋 SSH Deployment Setup

### 1. Generate SSH Key Pair

On your local machine:
```bash
# Generate a new SSH key pair
ssh-keygen -t rsa -b 4096 -C "github-actions-deploy"

# This creates:
# - ~/.ssh/id_rsa (private key)
# - ~/.ssh/id_rsa.pub (public key)
```

### 2. Add Public Key to Your Server

Copy the public key to your server:
```bash
# Copy public key to server
ssh-copy-id -i ~/.ssh/id_rsa.pub user@your-server.com

# Or manually add to ~/.ssh/authorized_keys on server
```

### 3. Configure GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add these secrets:

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `SSH_PRIVATE_KEY` | Contents of your private key file | `-----BEGIN RSA PRIVATE KEY-----...` |
| `REMOTE_HOST` | Your server's hostname or IP | `your-server.com` or `192.168.1.100` |
| `REMOTE_USER` | SSH username | `ubuntu`, `www-data`, or your username |
| `REMOTE_PATH` | Path to web directory | `/var/www/html/glasto2025` |

### 4. Test SSH Connection

Verify you can connect:
```bash
ssh user@your-server.com "ls -la /var/www/html/"
```

## 📁 FTP Deployment Setup

### 1. Configure GitHub Secrets

Add these secrets for FTP deployment:

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `FTP_HOST` | FTP server hostname | `ftp.your-host.com` |
| `FTP_USERNAME` | FTP username | `your-ftp-user` |
| `FTP_PASSWORD` | FTP password | `your-ftp-password` |
| `FTP_SERVER_DIR` | Remote directory path | `/public_html/glasto2025/` |

### 2. Enable FTP Workflow

The FTP workflow is set to manual trigger only. To enable automatic deployment:

1. Edit `.github/workflows/deploy-ftp.yml`
2. Uncomment the push trigger:
```yaml
on:
  push:
    branches: [ main ]
  workflow_dispatch:
```

## 🔄 How Deployment Works

### Trigger
- **Automatic**: Push to `main` branch
- **Manual**: Use GitHub Actions tab → "Run workflow"

### Process
1. ✅ **Checkout**: Downloads your code
2. ✅ **Setup**: Installs Node.js 18
3. ✅ **Install**: Runs `npm ci` to install dependencies
4. ✅ **Test**: Runs your test suite
5. ✅ **Build**: Creates production build in `build/` folder
6. ✅ **Deploy**: Uploads `build/` contents to your server

### What Gets Deployed
- All files from the `build/` directory
- Includes: HTML, CSS, JS, images, manifest, service worker
- Excludes: Source code, node_modules, git files

## 🎪 Festival Deployment Workflow

Perfect for updating your app during the festival:

### Quick Updates
1. **Edit locally**: Make changes (lineup updates, bug fixes)
2. **Commit & push**: `git add . && git commit -m "Update lineup" && git push origin main`
3. **Auto-deploy**: GitHub Actions builds and deploys automatically
4. **Live in ~2-3 minutes**: Your app is updated

### Emergency Fixes
1. **GitHub web editor**: Edit files directly on GitHub
2. **Commit to main**: Changes trigger deployment
3. **No local setup needed**: Deploy from anywhere with internet

## 🛠️ Troubleshooting

### SSH Issues
```bash
# Test SSH connection
ssh -T user@your-server.com

# Check SSH key permissions
chmod 600 ~/.ssh/id_rsa
chmod 644 ~/.ssh/id_rsa.pub
```

### Deployment Fails
1. Check GitHub Actions logs
2. Verify server permissions: `ls -la /var/www/html/`
3. Ensure web directory exists and is writable

### Build Fails
1. Check if tests pass locally: `npm test`
2. Verify dependencies: `npm ci && npm run build`
3. Check GitHub Actions logs for specific errors

## 🔒 Security Best Practices

1. **Use dedicated SSH key**: Don't reuse your personal SSH key
2. **Limit server access**: Create a dedicated deployment user
3. **Restrict permissions**: Only give write access to web directory
4. **Monitor deployments**: Check GitHub Actions logs regularly

## 📱 Mobile Deployment

Since you might need to deploy from your phone at the festival:

1. **GitHub Mobile App**: Edit files and commit directly
2. **GitHub Web**: Use mobile browser to edit and commit
3. **SSH from phone**: Use apps like Termius for emergency server access

## 🎯 Example Deployment Commands

```bash
# Quick lineup update
git add public/g2025.json
git commit -m "Update lineup: Add surprise guest"
git push origin main

# Emergency bug fix
git add src/components/Acts/Acts.tsx
git commit -m "Fix: Search not working on mobile"
git push origin main

# Version bump
git add package.json src/components/Footer/Footer.js
git commit -m "Version 2.5: Festival day updates"
git push origin main
```

Your app will be live within 2-3 minutes of pushing to main! 🚀 