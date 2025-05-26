-- 3. Inactive Users
-- Let's get a list of users who haven't signed up for any events in the last 90 days. Useful for re-engagement!

SELECT *
FROM Users
WHERE user_id NOT IN (
    SELECT user_id FROM Registrations
    WHERE registration_date >= CURDATE() - INTERVAL 90 DAY
);
