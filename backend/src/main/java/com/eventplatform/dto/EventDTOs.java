package com.eventplatform.dto;

import com.eventplatform.model.Event;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

public class EventDTOs {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateEventRequest {
        private String title;
        private String description;
        private String category;
        private String location;
        private LocalDateTime eventDate;
        private String organizerName;
        private String organizerEmail;
        private String imageUrl;
        private Integer maxAttendees;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EventResponse {
        private Long id;
        private String title;
        private String description;
        private String category;
        private String location;
        private LocalDateTime eventDate;
        private String organizerName;
        private String organizerEmail;
        private String imageUrl;
        private Event.EventStatus status;
        private Boolean emailVerified;
        private Integer maxAttendees;
        private LocalDateTime createdAt;

        public static EventResponse fromEvent(Event event) {
            EventResponse response = new EventResponse();
            response.setId(event.getId());
            response.setTitle(event.getTitle());
            response.setDescription(event.getDescription());
            response.setCategory(event.getCategory());
            response.setLocation(event.getLocation());
            response.setEventDate(event.getEventDate());
            response.setOrganizerName(event.getOrganizerName());
            response.setOrganizerEmail(event.getOrganizerEmail());
            response.setImageUrl(event.getImageUrl());
            response.setStatus(event.getStatus());
            response.setEmailVerified(event.getEmailVerified());
            response.setMaxAttendees(event.getMaxAttendees());
            response.setCreatedAt(event.getCreatedAt());
            return response;
        }
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VerifyCodeRequest {
        private Long eventId;
        private String code;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AdminActionRequest {
        private String action; // APPROVE or REJECT
        private String reason;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AdminLoginRequest {
        private String email;
        private String password;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AdminLoginResponse {
        private String token;
        private String email;
        private String name;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ApiResponse {
        private boolean success;
        private String message;
        private Object data;

        public static ApiResponse success(String message) {
            return new ApiResponse(true, message, null);
        }

        public static ApiResponse success(String message, Object data) {
            return new ApiResponse(true, message, data);
        }

        public static ApiResponse error(String message) {
            return new ApiResponse(false, message, null);
        }
    }
}
