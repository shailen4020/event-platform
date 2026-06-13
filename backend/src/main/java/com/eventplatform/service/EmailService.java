package com.eventplatform.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EmailService {

    public void sendVerificationCode(String toEmail, String organizerName, String eventTitle, String code) {
        log.info("==============================================");
        log.info("  VERIFICATION CODE FOR: {}", toEmail);
        log.info("  Event: {}", eventTitle);
        log.info("  CODE: {}", code);
        log.info("==============================================");
    }

    public void sendApprovalNotification(String toEmail, String organizerName, String eventTitle) {
        log.info("EVENT APPROVED - Notification for: {} | Event: {}", toEmail, eventTitle);
    }

    public void sendRejectionNotification(String toEmail, String organizerName, String eventTitle, String reason) {
        log.info("EVENT REJECTED - Notification for: {} | Event: {} | Reason: {}", toEmail, eventTitle, reason);
    }
}