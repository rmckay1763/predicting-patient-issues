-- migrate:up

CREATE TABLE IF NOT EXISTS public.patient (
	pid INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	firstname VARCHAR(64) NOT NULL,
	lastname VARCHAR(64) NOT NULL,
	age INT CONSTRAINT age_check CHECK (age > 0),
	gender CHAR(1) CONSTRAINT gender_check CHECK (gender IN ('m', 'f')),
	status VARCHAR(64) NOT NULL DEFAULT 'unobserved' 
		CONSTRAINT status_check CHECK (status IN ('stable', 'critical', 'unobserved'))
);

INSERT INTO 
	public.patient (firstname, lastname, age, gender, status)
VALUES 
	('Michael', 'Scott', 22, 'm', 'critical'),
	('Dwight', 'Shrute', 25, 'm', 'stable'),
	('Pam', 'Beesly', 32, 'f', 'stable'),
	('Jim', 'Halpert', 27, 'm', 'stable'),
	('Angela', 'Martin', 19, 'f', 'stable');

-- migrate:down

DROP TABLE IF EXISTS public.patient

