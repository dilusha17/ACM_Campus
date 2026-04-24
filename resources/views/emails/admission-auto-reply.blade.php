<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>body{font-family:Arial,sans-serif;color:#222;background:#f5f5f5;margin:0;padding:0}.wrap{max-width:600px;margin:30px auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08)}.header{background:#1a3a5c;color:#fff;padding:28px 32px}.header h1{margin:0;font-size:22px}.body{padding:28px 32px}.footer{background:#f0f0f0;padding:14px 32px;font-size:12px;color:#888;text-align:center}</style></head>
<body>
<div class="wrap">
  <div class="header"><h1>Application Received — ACM Campus</h1></div>
  <div class="body">
    <p>Dear {{ $admission->full_name }},</p>
    <p>Thank you for applying to <strong>Ashuvedya Complementary Medicine Campus</strong>. We are pleased to confirm that your application for the <strong>{{ $admission->program_slug }}</strong> programme has been received.</p>
    <p><strong>What happens next?</strong></p>
    <ul>
      <li>Your application will be reviewed by our admissions committee.</li>
      <li>You may be contacted for an interview or additional documents.</li>
      <li>A formal decision will be communicated within <strong>10–15 working days</strong>.</li>
    </ul>
    <p>If you have any questions in the meantime, do not hesitate to contact us at <a href="mailto:info@acmcampus.uk">info@acmcampus.uk</a>.</p>
    <p>We wish you every success with your application.</p>
    <p>Warm regards,<br><strong>ACM Campus Admissions Team</strong></p>
  </div>
  <div class="footer">Ashuvedya Complementary Medicine Campus · info@acmcampus.uk · acmcampus.uk</div>
</div>
</body>
</html>
