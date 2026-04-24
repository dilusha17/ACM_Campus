<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>body{font-family:Arial,sans-serif;color:#222;background:#f5f5f5;margin:0;padding:0}.wrap{max-width:600px;margin:30px auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08)}.header{background:#1a3a5c;color:#fff;padding:28px 32px}.header h1{margin:0;font-size:22px}.body{padding:28px 32px}.label{color:#888;font-size:12px;text-transform:uppercase;letter-spacing:.5px;margin-top:16px}.value{font-size:15px;margin:4px 0 0}.msg{background:#f9f9f9;border-left:4px solid #1a3a5c;padding:14px 16px;border-radius:4px;margin-top:6px;font-size:15px;white-space:pre-wrap}.footer{background:#f0f0f0;padding:14px 32px;font-size:12px;color:#888;text-align:center}</style></head>
<body>
<div class="wrap">
  <div class="header"><h1>New Contact Inquiry</h1></div>
  <div class="body">
    <p>A new message has been submitted through the ACM Campus contact form.</p>
    <div class="label">Name</div><div class="value">{{ $inquiry->name }}</div>
    <div class="label">Email</div><div class="value"><a href="mailto:{{ $inquiry->email }}">{{ $inquiry->email }}</a></div>
    <div class="label">Subject</div><div class="value">{{ $inquiry->subject }}</div>
    <div class="label">Message</div><div class="msg">{{ $inquiry->message }}</div>
    <p style="margin-top:24px"><a href="{{ url('/admin/contacts') }}" style="background:#1a3a5c;color:#fff;padding:10px 22px;border-radius:6px;text-decoration:none;font-size:14px">View in Admin Panel</a></p>
  </div>
  <div class="footer">ACM Campus · info@acmcampus.uk</div>
</div>
</body>
</html>
