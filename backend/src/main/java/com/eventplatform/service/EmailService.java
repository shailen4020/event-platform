package com.eventplatform.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import jakarta.mail.internet.MimeMessage;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendVerificationCode(String toEmail, String organizerName, String eventTitle, String code) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("🎉 Verify Your Event Submission - " + eventTitle);

            String htmlContent = buildVerificationEmail(organizerName, eventTitle, code);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            log.info("Verification code sent to: {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send verification email to: {}", toEmail, e);
            throw new RuntimeException("Failed to send email: " + e.getMessage());
        }
    }

    public void sendApprovalNotification(String toEmail, String organizerName, String eventTitle) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("✅ Your Event Has Been Approved! - " + eventTitle);

            String htmlContent = buildApprovalEmail(organizerName, eventTitle);
            helper.setText(htmlContent, true);

            mailSender.send(message);
        } catch (Exception e) {
            log.error("Failed to send approval email", e);
        }
    }

    public void sendRejectionNotification(String toEmail, String organizerName, String eventTitle, String reason) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("❌ Event Submission Update - " + eventTitle);

            String htmlContent = buildRejectionEmail(organizerName, eventTitle, reason);
            helper.setText(htmlContent, true);

            mailSender.send(message);
        } catch (Exception e) {
            log.error("Failed to send rejection email", e);
        }
    }

    private String buildVerificationEmail(String name, String eventTitle, String code) {
        return """
            <!DOCTYPE html>
            <html>
            <head><meta charset="UTF-8"></head>
            <body style="font-family: 'Segoe UI', Arial, sans-serif; background:#f5f5f5; margin:0; padding:20px;">
              <div style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,0.1);">
                <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%); padding:40px; text-align:center;">
                  <h1 style="color:#e94560; margin:0; font-size:28px; letter-spacing:2px;">EVENT PLATFORM</h1>
                  <p style="color:#a0aec0; margin:8px 0 0;">Verify Your Submission</p>
                </div>
                <div style="padding:40px;">
                  <h2 style="color:#1a1a2e; margin:0 0 16px;">Hello, %s! 👋</h2>
                  <p style="color:#4a5568; line-height:1.6;">Thank you for submitting your event <strong>"%s"</strong>. To complete your submission, please use the verification code below:</p>
                  <div style="background:#f7f9ff; border:2px dashed #e94560; border-radius:12px; padding:30px; text-align:center; margin:24px 0;">
                    <p style="color:#718096; margin:0 0 8px; font-size:14px; text-transform:uppercase; letter-spacing:1px;">Your Verification Code</p>
                    <div style="font-size:42px; font-weight:900; color:#1a1a2e; letter-spacing:12px; font-family:monospace;">%s</div>
                  </div>
                  <p style="color:#718096; font-size:14px; background:#fff5f5; padding:12px 16px; border-radius:8px; border-left:4px solid #e94560;">⏰ This code expires in <strong>30 minutes</strong>. Do not share this code with anyone.</p>
                  <p style="color:#4a5568; margin-top:24px;">Once verified, your event will be reviewed by our admin team and you'll be notified of the decision via email.</p>
                </div>
                <div style="background:#f7f9ff; padding:20px; text-align:center; border-top:1px solid #e2e8f0;">
                  <p style="color:#a0aec0; margin:0; font-size:13px;">© 2025 Event Platform. All rights reserved.</p>
                </div>
              </div>
            </body>
            </html>
            """.formatted(name, eventTitle, code);
    }

    private String buildApprovalEmail(String name, String eventTitle) {
        return """
            <!DOCTYPE html>
            <html>
            <body style="font-family: 'Segoe UI', Arial, sans-serif; background:#f5f5f5; margin:0; padding:20px;">
              <div style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,0.1);">
                <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%); padding:40px; text-align:center;">
                  <h1 style="color:#e94560; margin:0; font-size:28px; letter-spacing:2px;">EVENT PLATFORM</h1>
                </div>
                <div style="padding:40px; text-align:center;">
                  <div style="font-size:64px; margin-bottom:16px;">🎉</div>
                  <h2 style="color:#1a1a2e;">Congratulations, %s!</h2>
                  <p style="color:#4a5568; line-height:1.6; font-size:16px;">Your event <strong>"%s"</strong> has been <span style="color:#38a169; font-weight:bold;">APPROVED</span> and is now live on our platform!</p>
                  <p style="color:#4a5568;">Attendees can now discover and visit your event. Share the good news!</p>
                </div>
                <div style="background:#f7f9ff; padding:20px; text-align:center;">
                  <p style="color:#a0aec0; margin:0; font-size:13px;">© 2025 Event Platform</p>
                </div>
              </div>
            </body>
            </html>
            """.formatted(name, eventTitle);
    }

    private String buildRejectionEmail(String name, String eventTitle, String reason) {
        return """
            <!DOCTYPE html>
            <html>
            <body style="font-family: 'Segoe UI', Arial, sans-serif; background:#f5f5f5; margin:0; padding:20px;">
              <div style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,0.1);">
                <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%); padding:40px; text-align:center;">
                  <h1 style="color:#e94560; margin:0; font-size:28px; letter-spacing:2px;">EVENT PLATFORM</h1>
                </div>
                <div style="padding:40px;">
                  <h2 style="color:#1a1a2e;">Hello, %s</h2>
                  <p style="color:#4a5568; line-height:1.6;">We regret to inform you that your event <strong>"%s"</strong> was not approved at this time.</p>
                  <div style="background:#fff5f5; border-left:4px solid #e53e3e; padding:16px; border-radius:4px; margin:20px 0;">
                    <p style="color:#c53030; margin:0; font-weight:600;">Reason:</p>
                    <p style="color:#4a5568; margin:8px 0 0;">%s</p>
                  </div>
                  <p style="color:#4a5568;">You are welcome to resubmit after addressing the concerns mentioned above.</p>
                </div>
                <div style="background:#f7f9ff; padding:20px; text-align:center;">
                  <p style="color:#a0aec0; margin:0; font-size:13px;">© 2025 Event Platform</p>
                </div>
              </div>
            </body>
            </html>
            """.formatted(name, eventTitle, reason != null ? reason : "Does not meet our submission guidelines.");
    }
}
