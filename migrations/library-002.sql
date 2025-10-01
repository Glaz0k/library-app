CREATE OR REPLACE VIEW client_books_count_view AS
SELECT 
    c.*,
    COALESCE(j.books_count, 0) as books_count
FROM clients c
LEFT JOIN (
    SELECT 
        j.client_id,
        COUNT(*) AS books_count
    FROM journal j
    WHERE j.date_ret IS NULL
    GROUP BY j.client_id 
) j ON c.id = j.client_id;

CREATE OR REPLACE VIEW top_3_popular_books_view AS
SELECT 
    b.*, 
    COALESCE(popularity.total_book_count, 0) AS records_count
FROM public.books b
LEFT JOIN (
    SELECT 
        j.book_id,
        COUNT(*) AS total_book_count
    FROM public.journal j
    GROUP BY j.book_id
) popularity ON b.id = popularity.book_id
ORDER BY popularity.total_book_count DESC
LIMIT 3;