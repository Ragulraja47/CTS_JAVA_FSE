-- 2. Top Rated Events
-- Find events that have the best average ratings, but only include those with at least 10 feedbacks. Great for highlighting popular events!

SELECT e.title, AVG(f.rating) AS avg_rating, COUNT(f.feedback_id) AS feedback_count
FROM Events e
JOIN Feedback f ON e.event_id = f.event_id
GROUP BY e.event_id
HAVING COUNT(f.feedback_id) >= 10
ORDER BY avg_rating DESC;
