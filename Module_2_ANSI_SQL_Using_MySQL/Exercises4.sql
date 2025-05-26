-- 4. Peak Session Hours
-- For each event, count how many sessions are scheduled between 10 AM and 12 PM. Helps spot busy hours!

SELECT e.title, COUNT(s.session_id) AS peak_sessions
FROM Events e
JOIN Sessions s ON e.event_id = s.event_id
WHERE TIME(s.start_time) BETWEEN '10:00:00' AND '11:59:59'
GROUP BY e.event_id;
