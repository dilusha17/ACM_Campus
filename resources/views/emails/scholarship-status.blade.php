<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>body{font-family:Arial,sans-serif;color:#222;background:#f5f5f5;margin:0;padding:0}.wrap{max-width:600px;margin:30px auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08)}.header{background:#1a3a5c;color:#fff;padding:28px 32px}.header h1{margin:0;font-size:22px}.body{padding:28px 32px}.badge{display:inline-block;padding:6px 16px;border-radius:20px;font-size:13px;font-weight:bold;margin:12px 0}.badge-reviewed{background:#dbeafe;color:#1d4ed8}.badge-approved{background:#dcfce7;color:#166534}.badge-rejected{background:#fee2e2;color:#991b1b}.footer{background:#f0f0f0;padding:14px 32px;font-size:12px;color:#888;text-align:center}</style></head>
<body>
<div class="wrap">
  <div class="header"><h1>Scholarship Application Update — ACM Campus</h1></div>
  <div class="body">
    <p>Dear {{ $application->full_name }},</p>

    @if($newStatus === 'reviewed')
      <p>We are writing to let you know that your <strong>{{ $application->scheme }}</strong> scholarship application for the <strong>{{ $application->program_slug }}</strong> programme is currently <strong>under review</strong> by our scholarships committee.</p>
      <span class="badge badge-reviewed">Under Review</span>
      <p>We will notify you of our decision as soon as the review is complete.</p>

    @elseif($newStatus === 'approved')
      <p>We are thrilled to inform you that your <strong>{{ $application->scheme }}</strong> scholarship application for the <strong>{{ $application->program_slug }}</strong> programme has been <strong>approved</strong>!</p>
      <span class="badge badge-approved">Approved</span>
      <p>A member of our team will be in touch shortly to discuss next steps and the formal scholarship award letter.</p>
      <p>Congratulations, and welcome to ACM Campus!</p>

    @elseif($newStatus === 'rejected')
      <p>Thank you for applying for the <strong>{{ $application->scheme }}</strong> scholarship at ACM Campus. After thorough consideration, we regret that we are unable to offer you a scholarship at this time.</p>
      <span class="badge badge-rejected">Unsuccessful</span>
      <p>We appreciate the effort you put into your application. Should you wish to discuss this further or explore alternative financial support options, please contact us at <a href="mailto:info@acmcampus.uk">info@acmcampus.uk</a>.</p>

    @else
      <p>There has been an update to your <strong>{{ $application->scheme }}</strong> scholarship application. Your current status is: <strong>{{ ucfirst($newStatus) }}</strong>.</p>
    @endif

    <p>Warm regards,<br><strong>ACM Campus Scholarships Team</strong></p>
  </div>
  <div class="footer">Ashuvedya Complementary Medicine Campus · info@acmcampus.uk · acmcampus.uk</div>
</div>
</body>
</html>
