/**
 * 📧 EMAILJS SETUP GUIDE
 *
 * To enable the feedback form to send emails, follow these steps:
 *
 * 1️⃣ Go to https://www.emailjs.com and sign up/log in.
 *
 * 2️⃣ Create an email service:
 *     - Go to **Email Services** and click "Add New Service".
 *     - Choose a provider (e.g., Gmail) and connect your account.
 *     - Note down the **Service ID**.
 *
 * 3️⃣ Create an email template:
 *     - Go to **Email Templates** and click "Create New Template".
       - Inside the email body, use placeholders like:
 *       ```
 *       Name: {{user_name}}
 *       Email: {{user_email}}
 *       Message: {{message}}
 *       ```
 *     - These placeholders must match the keys sent from your form.
 *     - Save and note down the **Template ID**.
 *
 * 4️⃣ Get your Public Key:
 *     - Go to **Account > API Keys** and copy your **Public Key**.
 *
 * 5️⃣ Create a file `config.js` (DO NOT commit this file):
 *     ```js
 *     window.CONFIG = {
     EMAILJS_SERVICE_ID: 'your_service_id_here',
     EMAILJS_TEMPLATE_ID: 'your_template_id_here',
     EMAILJS_PUBLIC_KEY: 'your_public_key_here'
    };
 *     ```
 *
 * 6️⃣ Done! The feedback form will now send submissions to your email.
 */

window.CONFIG = {
  EMAILJS_SERVICE_ID: 'your_service_id_here',
  EMAILJS_TEMPLATE_ID: 'your_template_id_here',
  EMAILJS_PUBLIC_KEY: 'your_public_key_here'
};