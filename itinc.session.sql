SELECT  u.id,
    u.login,
    SUM(case WHEN u.id = pair.f_id THEN pair.f_score WHEN u.id = pair.s_id THEN pair.s_score end) AS sumScores,
    COUNT(*) AS gamesCount,
    round(AVG(case WHEN u.id = pair.f_id THEN pair.f_score WHEN u.id = pair.s_id THEN pair.s_score end),2) AS avgScores,
    count (case WHEN u.id = pair.f_id AND pair.f_score > pair.s_score THEN 1 WHEN u.id = pair.s_id AND pair.s_score > pair.f_score THEN 1 end) AS winsCount,
    count (case WHEN u.id = pair.f_id AND pair.f_score < pair.s_score THEN 1 WHEN u.id = pair.s_id AND pair.s_score < pair.f_score THEN 1 end) AS lossesCount,
    count (case WHEN u.id = pair.f_id AND pair.f_score = pair.s_score THEN 1 WHEN u.id = pair.s_id AND pair.s_score = pair.f_score THEN 1 end) AS drawsCount
    FROM "user" AS u
    LEFT OUTER JOIN pair_users_user
    ON (u.id = pair_users_user."userId")left outer
    JOIN pair
    ON (pair.id = pair_users_user."pairId")
    GROUP BY  u.id
    ORDER BY avgScores asc