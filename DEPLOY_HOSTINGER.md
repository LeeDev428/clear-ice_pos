# Hostinger Shared Hosting Deployment Guide (GitHub Actions + SSH)

## 1) First Step (Do This Now)
Rotate all exposed credentials immediately:
- SSH password
- MySQL password

Then switch deployment to SSH key authentication.

## 2) One-Time Server Paths
Use this structure on Hostinger:
- App code path: /home/<username>/apps/clear-ice_pos
- Public web root path: /home/<username>/domains/cleariceinc.com/public_html

## 3) Create SSH Key for GitHub Actions
On your local machine:
- Generate deploy key pair.
- Add the public key to Hostinger SSH authorized keys.
- Add the private key as a GitHub Actions repository secret.

## 4) Add GitHub Actions Secrets and Variables
Create these repository **secrets** in GitHub:
- HOSTINGER_SSH_HOST
- HOSTINGER_SSH_PORT
- HOSTINGER_SSH_USER
- HOSTINGER_SSH_KEY

Create these repository **variables** in GitHub:
- HOSTINGER_APP_PATH
- HOSTINGER_PUBLIC_PATH

Recommended values:
- HOSTINGER_APP_PATH=/home/<username>/apps/clear-ice_pos
- HOSTINGER_PUBLIC_PATH=/home/<username>/domains/cleariceinc.com/public_html

The workflow now validates these values before build/deploy and fails with a clear message if any are missing.

## 5) Server .env (One-Time)
SSH into server and create .env in APP_PATH.
Set production values (example keys):
- APP_ENV=production
- APP_DEBUG=false
- APP_URL=https://cleariceinc.com
- DB_CONNECTION=mysql
- DB_HOST=localhost
- DB_PORT=3306
- DB_DATABASE=<hostinger_db_name>
- DB_USERNAME=<hostinger_db_user>
- DB_PASSWORD=<hostinger_db_password>

Then run in APP_PATH:
- php artisan key:generate --force

## 6) Push to Master (Automatic CI/CD)
Push changes to master.
The workflow at .github/workflows/deploy-hostinger.yml will:
- Install PHP dependencies
- Build frontend assets
- Upload release package via SSH
- Run migrations and optimize commands
- Sync public files to public_html
- Rewrite public_html/index.php to point to APP_PATH

After this one-time setup, every push to `master` automatically deploys to production.

## 7) Verify Production
After successful workflow:
- Open https://cleariceinc.com
- Login and test Sales, Inventory, Collections, Payroll
- Check storage/logs/laravel.log for runtime issues

## Notes
- Do not commit .env.
- Do not use Vite dev server in production.
- If a deploy fails due to permissions, set writable access for storage and bootstrap/cache.
