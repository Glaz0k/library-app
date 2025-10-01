-- Autogenerate end_date on journal

CREATE OR REPLACE FUNCTION generate_end_date()
RETURNS TRIGGER AS $$
BEGIN
    NEW.date_end := (
        SELECT NEW.date_beg + bt.day_count
        FROM public.books b
        JOIN public.book_types bt ON b.type_id = bt.id
        WHERE b.id = NEW.book_id
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_end_date_generation
    BEFORE INSERT OR UPDATE OF date_beg ON public.journal
    FOR EACH ROW
    EXECUTE FUNCTION generate_end_date();

-- Auto decrease book stock on journal record

CREATE OR REPLACE FUNCTION take_book_from_stock()
RETURNS TRIGGER AS $$
BEGIN
    IF (NEW.date_ret IS NOT NULL) THEN
        RETURN NEW;
    END IF;

    IF EXISTS (
        SELECT 1
        FROM public.journal j
        WHERE j.client_id = NEW.client_id
        HAVING COUNT(*) < 10
    ) THEN
        UPDATE public.books b
        SET b.stock = b.stock - 1
        WHERE b.id = NEW.book_id;
    ELSE
        RAISE EXCEPTION 'Only clients with less than 10 books can take another';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_book_stock_on_beg
    BEFORE INSERT ON public.journal
    FOR EACH ROW
    EXECUTE FUNCTION take_book_from_stock();

-- Auto increase book stock on return

CREATE OR REPLACE FUNCTION return_book_to_stock()
RETURNS TRIGGER AS $$
BEGIN
    IF (OLD.date_ret IS NULL AND NEW.date_ret IS NOT NULL) THEN
        UPDATE public.books b
        SET b.stock = b.stock + 1
        WHERE b.id = NEW.book_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_book_stock_on_ret
    BEFORE UPDATE OF date_ret ON public.journal
    FOR EACH ROW
    EXECUTE FUNCTION return_book_to_stock();

-- Validate return date on return

CREATE OR REPLACE FUNCTION validate_date_ret()
RETURNS TRIGGER AS $$
BEGIN
    IF (NEW.date_ret IS NULL) THEN
        RETURN NEW;
    ELSIF (NEW.date_ret < NEW.date_beg) THEN
        RAISE EXCEPTION 'Return date (%) cannot be earlier than begin date (%)', NEW.date_ret, NEW.date_beg;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_date_ret_validation
    BEFORE UPDATE OF date_ret ON public.journal
    FOR EACH ROW
    EXECUTE FUNCTION validate_date_ret();

-- Validate delete only returned journal records

CREATE OR REPLACE FUNCTION validate_returned_book()
RETURNS TRIGGER AS $$
BEGIN
    IF (OLD.date_ret IS NULL) THEN
        RAISE EXCEPTION 'Cannot delete journal record, while book (%) is not returned', OLD.book_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_returned_book_delete_validation
    BEFORE DELETE ON journal
    FOR EACH ROW
    EXECUTE FUNCTION validate_returned_book();