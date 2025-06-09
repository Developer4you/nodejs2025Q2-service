DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'library') THEN
        CREATE DATABASE library;
    END IF;
END $$;