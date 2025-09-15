# 📧 Gmail Setup for Password Reset

## Step 1: Enable 2-Factor Authentication
1. Go to your Google Account: https://myaccount.google.com/
2. Click on "Security" in the left sidebar
3. Under "Signing in to Google", click on "2-Step Verification"
4. Follow the steps to enable 2FA if not already enabled

## Step 2: Generate App Password
1. Go to: https://myaccount.google.com/apppasswords
   - Or: Google Account → Security → App passwords
2. Select "Mail" from the dropdown
3. Click "Generate"
4. Copy the 16-character app password (e.g., `abcd efgh ijkl mnop`)

## Step 3: Update .env File
Edit `server/.env` and replace these lines:

```env
# Email Configuration (Gmail)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

With your actual Gmail credentials:

```env
# Email Configuration (Gmail)
EMAIL_USER=youremail@gmail.com
EMAIL_PASS=abcdefghijklmnop
```

**Important:** 
- Use your full Gmail address (e.g., `john.doe@gmail.com`)
- Use the 16-character app password (no spaces)
- Do NOT use your regular Gmail password

## Step 4: Restart Server
After updating the .env file, restart the server:

```powershell
./start-dev.ps1
```

## Step 5: Test
1. Go to `/forgot-password`
2. Enter a registered email address
3. Check your email for the 6-digit verification code

## Troubleshooting

If emails still don't arrive:
1. Check spam/junk folder
2. Verify the email address is registered in your system
3. Check server console for error messages
4. Ensure 2FA is enabled on your Gmail account

## Alternative: Use a Test Email
For development, you can use a temporary email service like:
- https://temp-mail.org/
- https://10minutemail.com/

Just make sure to register an account in your system with that email first.