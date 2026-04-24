<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>body{font-family:Arial,sans-serif;color:#222;background:#f5f5f5;margin:0;padding:0}.wrap{max-width:600px;margin:30px auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08)}.header{background:#1a3a5c;color:#fff;padding:28px 32px}.header h1{margin:0;font-size:22px}.body{padding:28px 32px}.footer{background:#f0f0f0;padding:14px 32px;font-size:12px;color:#888;text-align:center}</style></head>
<body>
<div class="wrap">
  <div class="header"><h1>Thank You for Reaching Out</h1></div>
  <div class="body">
    <p>Dear {{ $inquiry->name }},</p>
    <p>Thank you for contacting <strong>Ashuvedya Complementary Medicine Campus</strong>. We have received your message and our team will get back to you within <strong>2–3 working days</strong>.</p>
    <p><strong>Your message:</strong></p>
    <blockquote style="border-left:4px solid #1a3a5c;margin:0;padding:12px 16px;background:#f9f9f9;color:#444;border-radius:4px">{{ $inquiry->message }}</blockquote>
    <p style="margin-top:24px">If your enquiry is urgent, please call us directly or reply to this email.</p>
    <p>Warm regards,<br><strong>ACM Campus Admissions Team</strong></p>
  </div>
  <div class="footer">Ashuvedya Complementary Medicine Campus · info@acmcampus.uk · acmcampus.uk</div>
</div>
</body>
</html>
