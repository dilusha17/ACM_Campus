<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>body{font-family:Arial,sans-serif;color:#222;background:#f5f5f5;margin:0;padding:0}.wrap{max-width:600px;margin:30px auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08)}.header{background:#1a3a5c;color:#fff;padding:28px 32px}.header h1{margin:0;font-size:22px}.body{padding:28px 32px}.footer{background:#f0f0f0;padding:14px 32px;font-size:12px;color:#888;text-align:center}</style></head>
<body>
<div class="wrap">
  <div class="header"><h1>Scholarship Application Received</h1></div>
  <div class="body">
    <p>Dear {{ $application->full_name }},</p>
    <p>Thank you for applying for the <strong>{{ $application->scheme }}</strong> Scholarship at <strong>Ashuvedya Complementary Medicine Campus</strong>. Your application for the <strong>{{ $application->program_slug }}</strong> programme has been received and is under review.</p>
    <p><strong>What happens next?</strong></p>
    <ul>
      <li>Our scholarships committee reviews applications on a monthly basis.</li>
      <li>Your referees (<strong>{{ $application->referee1_name }}</strong> and <strong>{{ $application->referee2_name }}</strong>) may be contacted for references.</li>
      <li>You will receive a decision by email within <strong>4–6 weeks</strong>.</li>
    </ul>
    <p>For any questions, please contact us at <a href="mailto:info@acmcampus.uk">info@acmcampus.uk</a>.</p>
    <p>We appreciate your interest in advancing your education through ACM Campus.</p>
    <p>Warm regards,<br><strong>ACM Campus Scholarships Committee</strong></p>
  </div>
  <div class="footer">Ashuvedya Complementary Medicine Campus · info@acmcampus.uk · acmcampus.uk</div>
</div>
</body>
</html>
