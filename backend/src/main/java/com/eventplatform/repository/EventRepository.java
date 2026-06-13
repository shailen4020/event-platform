package com.eventplatform.repository;

import com.eventplatform.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    List<Event> findByStatusOrderByEventDateAsc(Event.EventStatus status);

    List<Event> findAllByOrderByCreatedAtDesc();

    Optional<Event> findByIdAndSubmissionCode(Long id, String submissionCode);

    @Query("SELECT e FROM Event e WHERE e.status = 'APPROVED' AND " +
           "(:category IS NULL OR e.category = :category) AND " +
           "(:search IS NULL OR LOWER(e.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(e.description) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(e.location) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "ORDER BY e.eventDate ASC")
    List<Event> findApprovedEventsWithFilter(@Param("category") String category,
                                              @Param("search") String search);

    List<Event> findByOrganizerEmailOrderByCreatedAtDesc(String email);
}
