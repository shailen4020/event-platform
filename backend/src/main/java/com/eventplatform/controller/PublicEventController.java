package com.eventplatform.controller;

import com.eventplatform.dto.EventDTOs.*;
import com.eventplatform.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicEventController {

    private final EventService eventService;

    @GetMapping("/events")
    public ResponseEntity<List<EventResponse>> getApprovedEvents(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(eventService.getApprovedEvents(category, search));
    }

    @GetMapping("/events/{id}")
    public ResponseEntity<EventResponse> getEvent(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.getEventById(id));
    }

    @PostMapping("/events/submit")
    public ResponseEntity<ApiResponse> submitEvent(@RequestBody CreateEventRequest request) {
        try {
            EventResponse event = eventService.submitEvent(request);
            return ResponseEntity.ok(ApiResponse.success(
                "Event submitted! Check your email for the verification code.",
                event
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/events/verify")
    public ResponseEntity<ApiResponse> verifyCode(@RequestBody VerifyCodeRequest request) {
        boolean verified = eventService.verifySubmissionCode(request.getEventId(), request.getCode());
        if (verified) {
            return ResponseEntity.ok(ApiResponse.success(
                "Email verified successfully! Your event is now pending admin review."
            ));
        } else {
            return ResponseEntity.badRequest().body(ApiResponse.error("Invalid or expired verification code."));
        }
    }

    @GetMapping("/events/by-email/{email}")
    public ResponseEntity<List<EventResponse>> getEventsByEmail(@PathVariable String email) {
        return ResponseEntity.ok(eventService.getEventsByEmail(email));
    }
}
