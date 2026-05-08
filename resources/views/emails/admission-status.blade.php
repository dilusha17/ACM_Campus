<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>body{font-family:Arial,sans-serif;color:#222;background:#f5f5f5;margin:0;padding:0}.wrap{max-width:600px;margin:30px auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08)}.header{background:#1a3a5c;color:#fff;padding:28px 32px}.header h1{margin:0;font-size:22px}.body{padding:28px 32px}.badge{display:inline-block;padding:6px 16px;border-radius:20px;font-size:13px;font-weight:bold;margin:12px 0}.badge-reviewed{background:#dbeafe;color:#1d4ed8}.badge-accepted{background:#dcfce7;color:#166534}.badge-rejected{background:#fee2e2;color:#991b1b}.footer{background:#f0f0f0;padding:14px 32px;font-size:12px;color:#888;text-align:center}</style></head>
<body>
<div class="wrap">
  <div class="header"><h1>Application Update — ACM Campus</h1></div>
  <div class="body">
    <p>Dear {{ $admission->full_name }},</p>

    @if($newStatus === 'reviewed')
      <p>Thank you for your patience. We are pleased to inform you that your application for the <strong>{{ $admission->program_slug }}</strong> programme is currently <strong>under review</strong> by our admissions committee.</p>
      <span class="badge badge-reviewed">Under Review</span>
      <p>We will be in touch with a final decision shortly. If you have any questions, please contact us at <a href="mailto:info@acmcampus.uk">info@acmcampus.uk</a>.</p>

    @elseif($newStatus === 'accepted')
      <p>We are delighted to inform you that your application for the <strong>{{ $admission->program_slug }}</strong> programme has been <strong>accepted</strong>!</p>
      <span class="badge badge-accepted">Accepted</span>

      <p>To complete your enrolment and create your student profile, please reply to this email or contact us at <a href="mailto:info@acmcampus.uk">info@acmcampus.uk</a> with the following details:</p>

      <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:14px">
        <tr style="background:#f0f4f8">
          <td style="padding:8px 12px;border:1px solid #dde3ea;font-weight:bold;width:40%">First Name</td>
          <td style="padding:8px 12px;border:1px solid #dde3ea;color:#555">As on your official ID</td>
        </tr>
        <tr>
          <td style="padding:8px 12px;border:1px solid #dde3ea;font-weight:bold">Last Name</td>
          <td style="padding:8px 12px;border:1px solid #dde3ea;color:#555">As on your official ID</td>
        </tr>
        <tr style="background:#f0f4f8">
          <td style="padding:8px 12px;border:1px solid #dde3ea;font-weight:bold">Full Legal Name</td>
          <td style="padding:8px 12px;border:1px solid #dde3ea;color:#555">As it should appear on your student record</td>
        </tr>
        <tr>
          <td style="padding:8px 12px;border:1px solid #dde3ea;font-weight:bold">NIC / Passport No.</td>
          <td style="padding:8px 12px;border:1px solid #dde3ea;color:#555">National ID card number or passport number</td>
        </tr>
        <tr style="background:#f0f4f8">
          <td style="padding:8px 12px;border:1px solid #dde3ea;font-weight:bold">Email Address</td>
          <td style="padding:8px 12px;border:1px solid #dde3ea;color:#555">Your preferred contact email</td>
        </tr>
        <tr>
          <td style="padding:8px 12px;border:1px solid #dde3ea;font-weight:bold">Date of Birth</td>
          <td style="padding:8px 12px;border:1px solid #dde3ea;color:#555">DD / MM / YYYY</td>
        </tr>
        <tr style="background:#f0f4f8">
          <td style="padding:8px 12px;border:1px solid #dde3ea;font-weight:bold">Nationality</td>
          <td style="padding:8px 12px;border:1px solid #dde3ea;color:#555">Country of citizenship</td>
        </tr>
        <tr>
          <td style="padding:8px 12px;border:1px solid #dde3ea;font-weight:bold">Contact Number</td>
          <td style="padding:8px 12px;border:1px solid #dde3ea;color:#555">Including country code</td>
        </tr>
        <tr style="background:#f0f4f8">
          <td style="padding:8px 12px;border:1px solid #dde3ea;font-weight:bold">Home Address</td>
          <td style="padding:8px 12px;border:1px solid #dde3ea;color:#555">Full postal address</td>
        </tr>
      </table>

      <p>Please also attach the following documents to your reply:</p>
      <ul style="font-size:14px;color:#444;line-height:1.9;margin:8px 0 16px 0;padding-left:20px">
        <li><strong>Profile Photo</strong> — Clear passport-style photo (JPEG or PNG, max 5 MB)</li>
        <li><strong>Copy of NIC / Passport</strong> — Scanned copy of your valid national ID card or passport</li>
      </ul>

      <p>Once we receive your details, our team will set up your student profile and send you your unique Student ID along with further enrolment instructions.</p>
      <p>We look forward to welcoming you to Ashuvedya Complementary Medicine Campus.</p>

    @elseif($newStatus === 'rejected')
      <p>Thank you for your interest in the <strong>{{ $admission->program_slug }}</strong> programme at ACM Campus. After careful consideration, we regret to inform you that we are unable to offer you a place at this time.</p>
      <span class="badge badge-rejected">Unsuccessful</span>
      <p>We encourage you to consider reapplying in future intakes or exploring other programmes we offer. Please do not hesitate to contact us if you would like feedback on your application.</p>

    @else
      <p>There has been an update to your application for the <strong>{{ $admission->program_slug }}</strong> programme. Your current application status is: <strong>{{ ucfirst($newStatus) }}</strong>.</p>
    @endif

    <p>Warm regards,<br><strong>ACM Campus Admissions Team</strong></p>
  </div>
  <div class="footer">Ashuvedya Complementary Medicine Campus · info@acmcampus.uk · acmcampus.uk</div>
</div>
</body>
</html>
