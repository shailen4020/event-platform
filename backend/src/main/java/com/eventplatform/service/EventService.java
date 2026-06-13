package com.eventplatform.service;

import com.eventplatform.dto.EventDTOs.*;
import com.eventplatform.model.Event;
import com.eventplatform.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class EventService {

    private final EventRepository eventRepository;
    private final EmailService emailService;
    private final SecureRandom random = new SecureRandom();

    @Transactional
    public EventResponse submitEvent(CreateEventRequest request) {
        // Generate 6-digit verification code
        String code = String.format("%06d", random.nextInt(999999));

        Event event = new Event();
        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setCategory(request.getCategory());
        event.setLocation(request.getLocation());
        event.setEventDate(request.getEventDate());
        event.setOrganizerName(request.getOrganizerName());
        event.setOrganizerEmail(request.getOrganizerEmail());
        event.setImageUrl(request.getImageUrl());
        event.setMaxAttendees(request.getMaxAttendees());
        event.setStatus(Event.EventStatus.PENDING);
        event.setSubmissionCode(code);
        event.setEmailVerified(false);

        Event saved = eventRepository.save(event);

        // Send verification email
        try {
            emailService.sendVerificationCode(
                request.getOrganizerEmail(),
                request.getOrganizerName(),
                request.getTitle(),
                code
            );
        } catch (Exception e) {
            log.warn("Could not send email, but event was saved. Code: {}", code);
        }

        return EventResponse.fromEvent(saved);
    }

    @Transactional
    public boolean verifySubmissionCode(Long eventId, String code) {
        return eventRepository.findByIdAndSubmissionCode(eventId, code)
            .map(event -> {
                event.setEmailVerified(true);
                eventRepository.save(event);
                return true;
            })
            .orElse(false);
    }

    public List<EventResponse> getApprovedEvents(String category, String search) {
        String cat = (category != null && category.isBlank()) ? null : category;
        String srch = (search != null && search.isBlank()) ? null : search;
        return eventRepository.findApprovedEventsWithFilter(cat, srch)
            .stream()
            .map(EventResponse::fromEvent)
            .collect(Collectors.toList());
    }

    public List<EventResponse> getAllEventsForAdmin() {
        return eventRepository.findAllByOrderByCreatedAtDesc()
            .stream()
            .map(EventResponse::fromEvent)
            .collect(Collectors.toList());
    }

    public EventResponse getEventById(Long id) {
        return eventRepository.findById(id)
            .map(EventResponse::fromEvent)
            .orElseThrow(() -> new RuntimeException("Event not found with id: " + id));
    }

    @Transactional
    public EventResponse approveEvent(Long id) {
        Event event = eventRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Event not found"));
        event.setStatus(Event.EventStatus.APPROVED);
        Event saved = eventRepository.save(event);

        try {
            emailService.sendApprovalNotification(
                event.getOrganizerEmail(),
                event.getOrganizerName(),
                event.getTitle()
            );
        } catch (Exception e) {
            log.warn("Could not send approval email", e);
        }

        return EventResponse.fromEvent(saved);
    }

    @Transactional
    public EventResponse rejectEvent(Long id, String reason) {
        Event event = eventRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Event not found"));
        event.setStatus(Event.EventStatus.REJECTED);
        Event saved = eventRepository.save(event);

        try {
            emailService.sendRejectionNotification(
                event.getOrganizerEmail(),
                event.getOrganizerName(),
                event.getTitle(),
                reason
            );
        } catch (Exception e) {
            log.warn("Could not send rejection email", e);
        }

        return EventResponse.fromEvent(saved);
    }

    public List<EventResponse> getEventsByEmail(String email) {
        return eventRepository.findByOrganizerEmailOrderByCreatedAtDesc(email)
            .stream()
            .map(EventResponse::fromEvent)
            .collect(Collectors.toList());
    }

    public long countByStatus(Event.EventStatus status) {
        return eventRepository.findByStatusOrderByEventDateAsc(status).size();
    }
}
