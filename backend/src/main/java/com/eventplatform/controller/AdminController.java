package com.eventplatform.controller;

import com.eventplatform.dto.EventDTOs.*;
import com.eventplatform.model.Admin;
import com.eventplatform.repository.AdminRepository;
import com.eventplatform.security.JwtUtil;
import com.eventplatform.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final EventService eventService;
    private final AdminRepository adminRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@RequestBody AdminLoginRequest request) {
        return adminRepository.findByEmail(request.getEmail())
            .filter(admin -> passwordEncoder.matches(request.getPassword(), admin.getPassword()))
            .map(admin -> {
                String token = jwtUtil.generateToken(admin.getEmail());
                AdminLoginResponse resp = new AdminLoginResponse(token, admin.getEmail(), admin.getName());
                return ResponseEntity.ok(ApiResponse.success("Login successful", resp));
            })
            .orElse(ResponseEntity.status(401).body(ApiResponse.error("Invalid email or password")));
    }

    @GetMapping("/events")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<EventResponse>> getAllEvents() {
        return ResponseEntity.ok(eventService.getAllEventsForAdmin());
    }

    @GetMapping("/events/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EventResponse> getEvent(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.getEventById(id));
    }

    @PostMapping("/events/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> approveEvent(@PathVariable Long id) {
        try {
            EventResponse event = eventService.approveEvent(id);
            return ResponseEntity.ok(ApiResponse.success("Event approved successfully!", event));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/events/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> rejectEvent(@PathVariable Long id,
                                                    @RequestBody(required = false) AdminActionRequest request) {
        try {
            String reason = request != null ? request.getReason() : null;
            EventResponse event = eventService.rejectEvent(id, reason);
            return ResponseEntity.ok(ApiResponse.success("Event rejected.", event));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Long>> getStats() {
        return ResponseEntity.ok(Map.of(
            "pending", eventService.countByStatus(com.eventplatform.model.Event.EventStatus.PENDING),
            "approved", eventService.countByStatus(com.eventplatform.model.Event.EventStatus.APPROVED),
            "rejected", eventService.countByStatus(com.eventplatform.model.Event.EventStatus.REJECTED)
        ));
    }
}
