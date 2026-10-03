@if($detailRequest)
  <p>To set up your student profile, please complete our short online form. We already have your <strong>name, email address and programme</strong> on file, so you only need to provide the remaining details:</p>

  <ul style="font-size:14px;color:#444;line-height:1.9;margin:8px 0 16px 0;padding-left:20px">
    <li>NIC or passport number</li>
    <li>Date of birth</li>
    <li>Nationality and gender</li>
    <li>Country and phone number</li>
    <li>Home address</li>
    <li><strong>A clear passport-style photo</strong> (JPEG, PNG or WebP, <strong>under 5 MB</strong>)</li>
  </ul>

  <p style="text-align:center;margin:24px 0">
    <a href="{{ $detailRequest->url() }}" style="background:#1a3a5c;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:6px;font-weight:bold;font-size:14px;display:inline-block">Complete Your Student Details</a>
  </p>

  <p style="font-size:12px;color:#888">If the button does not work, copy this link into your browser:<br><a href="{{ $detailRequest->url() }}" style="color:#1d4ed8;word-break:break-all">{{ $detailRequest->url() }}</a><br>This link can be used once and is valid until {{ $detailRequest->expires_at->format('j F Y') }}.</p>

  <p>Once we receive your details, our team will create your student profile and send you your Student ID along with further enrolment instructions.</p>
@endif
