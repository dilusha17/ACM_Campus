<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>body{font-family:Arial,sans-serif;color:#222;background:#f5f5f5;margin:0;padding:0}.wrap{max-width:600px;margin:30px auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08)}.header{background:#1a3a5c;color:#fff;padding:28px 32px}.header h1{margin:0;font-size:22px}.body{padding:28px 32px}.meta{width:100%;border-collapse:collapse;margin:18px 0}.meta td{padding:9px 0;border-bottom:1px solid #eef2f6;font-size:14px;vertical-align:top}.meta td:first-child{width:42%;font-weight:bold;color:#51606f}.footer{background:#f0f0f0;padding:14px 32px;font-size:12px;color:#888;text-align:center}</style></head>
<body>
<div class="wrap">
  <div class="header"><h1>Welcome to ACM Campus</h1></div>
  <div class="body">
    <p>Dear Student,</p>
    <p>Congratulations!</p>
    <p>We are pleased to inform you that your student account has been created successfully at ACM Campus.</p>

    <table class="meta">
      <tr><td>Student Name</td><td>{{ $student->full_name }}</td></tr>
      <tr><td>Your Student ID</td><td>{{ $student->student_id }}</td></tr>
      <tr><td>Course</td><td>{{ $studentProgram->program_title ?? $studentProgram->program_slug ?? '—' }}</td></tr>
      <tr><td>Country</td><td>{{ $student->nationality?->name ?? '—' }}</td></tr>
      <tr><td>Mobile</td><td>{{ trim(($student->phone_country_code ? $student->phone_country_code . ' ' : '') . ($student->phone ?? '')) ?: '—' }}</td></tr>
      <tr><td>Enrolled Date</td><td>{{ $studentProgram->enrollment_date?->format('d-m-Y') ?? '—' }}</td></tr>
    </table>

    <p>Welcome to ACM Campus, and we wish you success in your future studies.</p>

    <p>Best Regards,<br><strong>ACM Campus Administration</strong></p>
    <p>Inquiry<br>Sri Lanka: (+94) 70 408 4321</p>
  </div>
  <div class="footer">Ashuvedya Complementary Medicine Campus · info@acmcampus.uk · acmcampus.uk</div>
</div>
</body>
</html>