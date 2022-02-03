-- migrate:up
CREATE TABLE IF NOT EXISTS public.vital (
	pid INT REFERENCES public.patient(pid),
	entered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	heart_rate NUMERIC DEFAULT 80.0,
	temperature NUMERIC DEFAULT 98.6
);

DO $$
BEGIN
FOR i IN 1..5 LOOP
	INSERT INTO public.vital(pid) VALUES (1), (2), (3);
END LOOP;
END;
$$;

-- migrate:down
DROP TABLE IF EXISTS public.vital;