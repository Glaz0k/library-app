CREATE OR REPLACE FUNCTION get_client_fine(client_id integer) RETURNS integer AS
$$
    SELECT COALESCE(SUM((current_date - j.date_end) * bt.fine), 0)
    FROM public.journal j
    JOIN public.books b ON j.book_id = b.id
    JOIN public.book_types bt ON b.type_id = bt.id
    WHERE j.client_id = get_client_fine.client_id
    AND j.date_ret IS NULL
    AND (current_date - j.date_end) > bt.day_count    
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION get_max_fine() RETURNS integer AS
$$
    SELECT COALESCE(MAX(total_client_fine), 0)
    FROM (
        SELECT SUM((current_date - j.date_end) * bt.fine) AS total_client_fine
        FROM public.journal j
        JOIN public.books b ON j.book_id = b.id
        JOIN public.book_types bt ON b.type_id = bt.id
        WHERE j.date_ret IS NULL
        AND (current_date - j.date_end) > bt.day_count 
        GROUP BY j.client_id
    )
$$ LANGUAGE SQL;