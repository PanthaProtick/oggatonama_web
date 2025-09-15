# Email Setup for Password Reset

To enable email functionality for password reset, you need to configure email settings in `server/.env`:

## Gmail Setup (Recommended)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Gmail → Manage Account → Security → App passwords
   - Generate a new app password for "Mail"
   - Copy the 16-character password

3. **Update server/.env file**:
   ```env
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_16_character_app_password
   ```

4. **Restart the server** after updating the .env file

## Other Email Providers

You can use other email services by modifying the transporter configuration in `server/index.js`:

### Outlook/Hotmail
```javascript
service: 'hotmail'
```

### Yahoo
```javascript
service: 'yahoo'
```

### Custom SMTP
```javascript
host: 'your-smtp-server.com',
port: 587,
secure: false, // true for 465, false for other ports
```

## Testing

1. Go to `/forgot-password`
2. Enter a registered email address
3. Check your email for a 6-digit verification code
4. Use the code to reset your password

## Security Notes

- App passwords are safer than using your main Gmail password
- The verification code expires after 1 hour
- Codes are only valid once and are cleared after use