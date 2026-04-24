<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>body{font-family:Arial,sans-serif;color:#222;background:#f5f5f5;margin:0;padding:0}.wrap{max-width:600px;margin:30px auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08)}.header{background:#1a3a5c;color:#fff;padding:28px 32px}.header h1{margin:0;font-size:22px}.body{padding:28px 32px}.original{background:#f9fafb;border-left:3px solid #d1d5db;padding:14px 18px;margin-top:20px;font-size:13px;color:#555}.footer{background:#f0f0f0;padding:14px 32px;font-size:12px;color:#888;text-align:center}</style></head>
<body>
<div class="wrap">
  <div class="header"><h1>Re: {{ $inquiry->subject }}</h1></div>
  <div class="body">
    <p>Dear {{ $inquiry->name }},</p>
    <p>Thank you for getting in touch with us. Please find our response below:</p>
    <p style="line-height:1.7;white-space:pre-wrap;">{{ $replyMessage }}</p>
    <p>If you have any further questions, please do not hesitate to contact us at <a href="mailto:info@acmcampus.uk">info@acmcampus.uk</a>.</p>
    <p>Kind regards,<br><strong>ACM Campus Team</strong></p>
    <div class="original">
      <p style="margin:0 0 8px 0;font-weight:bold;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:.05em">Original Message</p>
      <p style="margin:0;white-space:pre-wrap;">{{ $inquiry->message }}</p>
    </div>
  </div>
  <div class="footer">Ashuvedya Complementary Medicine Campus · info@acmcampus.uk · acmcampus.uk</div>
</div>
</body>
</html>
