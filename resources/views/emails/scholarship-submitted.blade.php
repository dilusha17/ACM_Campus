<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>body{font-family:Arial,sans-serif;color:#222;background:#f5f5f5;margin:0;padding:0}.wrap{max-width:600px;margin:30px auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08)}.header{background:#1a3a5c;color:#fff;padding:28px 32px}.header h1{margin:0;font-size:22px}.body{padding:28px 32px}.label{color:#888;font-size:12px;text-transform:uppercase;letter-spacing:.5px;margin-top:16px}.value{font-size:15px;margin:4px 0 0}.msg{background:#f9f9f9;border-left:4px solid #1a3a5c;padding:14px 16px;border-radius:4px;margin-top:6px;font-size:15px;white-space:pre-wrap}.footer{background:#f0f0f0;padding:14px 32px;font-size:12px;color:#888;text-align:center}</style></head>
<body>
<div class="wrap">
  <div class="header"><h1>New Scholarship Application</h1></div>
  <div class="body">
    <p>A new scholarship application has been submitted.</p>
    <div class="label">Full Name</div><div class="value">{{ $application->full_name }}</div>
    <div class="label">Email</div><div class="value"><a href="mailto:{{ $application->email }}">{{ $application->email }}</a></div>
    <div class="label">Programme</div><div class="value">{{ $application->program_slug }}</div>
    <div class="label">Scheme</div><div class="value">{{ $application->scheme }}</div>
    <div class="label">Annual Household Income</div><div class="value">{{ $application->annual_household_income }}</div>
    <div class="label">Motivation Statement</div><div class="msg">{{ $application->motivation_statement }}</div>
    <div class="label">Referee 1</div><div class="value">{{ $application->referee1_name }} — <a href="mailto:{{ $application->referee1_email }}">{{ $application->referee1_email }}</a></div>
    <div class="label">Referee 2</div><div class="value">{{ $application->referee2_name }} — <a href="mailto:{{ $application->referee2_email }}">{{ $application->referee2_email }}</a></div>
    <p style="margin-top:24px"><a href="{{ url('/admin/scholarships') }}" style="background:#1a3a5c;color:#fff;padding:10px 22px;border-radius:6px;text-decoration:none;font-size:14px">Review in Admin Panel</a></p>
  </div>
  <div class="footer">ACM Campus · info@acmcampus.uk</div>
</div>
</body>
</html>
