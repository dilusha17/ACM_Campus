<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>body{font-family:Arial,sans-serif;color:#222;background:#f5f5f5;margin:0;padding:0}.wrap{max-width:600px;margin:30px auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08)}.header{background:#1a3a5c;color:#fff;padding:28px 32px}.header h1{margin:0;font-size:22px}.body{padding:28px 32px}.label{color:#888;font-size:12px;text-transform:uppercase;letter-spacing:.5px;margin-top:16px}.value{font-size:15px;margin:4px 0 0}.footer{background:#f0f0f0;padding:14px 32px;font-size:12px;color:#888;text-align:center}</style></head>
<body>
<div class="wrap">
  <div class="header"><h1>Student Details Received</h1></div>
  <div class="body">
    <p>An applicant has completed the student-details form. Their details and photo are ready for review.</p>
    <div class="label">Full Name</div><div class="value">{{ $detailRequest->full_name }}</div>
    <div class="label">Email</div><div class="value"><a href="mailto:{{ $detailRequest->email }}">{{ $detailRequest->email }}</a></div>
    <div class="label">Programme</div><div class="value">{{ $detailRequest->program?->title ?? '—' }}</div>
    <div class="label">Application</div><div class="value">{{ $detailRequest->sourceLabel() }}</div>
    <div class="label">Submitted</div><div class="value">{{ $detailRequest->submitted_at?->format('j F Y, H:i') }}</div>
    @if($detailRequest->adminUrl())
    <p style="margin-top:24px"><a href="{{ $detailRequest->adminUrl() }}" style="background:#1a3a5c;color:#fff;padding:10px 22px;border-radius:6px;text-decoration:none;font-size:14px;display:inline-block">Open {{ $detailRequest->admission_id ? 'Admission' : 'Scholarship' }} Application</a></p>
    <p style="font-size:12px;color:#888">You will need to be signed in to the admin panel. There you can review the submitted details and create the verified student record.</p>
    @endif
  </div>
  <div class="footer">ACM Campus · info@acmcampus.uk</div>
</div>
</body>
</html>
