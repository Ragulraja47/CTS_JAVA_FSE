-- 5. Most Active Cities
-- Show me the top 5 cities where the most users have registered for events. Great for city-wise engagement stats!

SELECT u.city, COUNT(DISTINCT r.user_id) AS total_users
FROM Users u
JOIN Registrations r ON u.user_id = r.user_id
GROUP BY u.city
ORDER BY total_users DESC
LIMIT 5;
