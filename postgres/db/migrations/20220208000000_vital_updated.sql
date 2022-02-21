-- migrate:up

DROP TABLE IF EXISTS public.vital;
DROP TABLE IF EXISTS public.patient;

CREATE TABLE IF NOT EXISTS public.patient (
	pid INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	admit_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	firstname VARCHAR(64) NOT NULL,
	lastname VARCHAR(64) NOT NULL,
	age INT CONSTRAINT age_check CHECK (age > 0),
	gender CHAR(1) CONSTRAINT gender_check CHECK (gender IN ('m', 'f')),
	status INT NOT NULL DEFAULT 10
		CONSTRAINT status_check CHECK (status IN (0, 9, 10))
);

CREATE TABLE IF NOT EXISTS public.vital (
	pid INT REFERENCES public.patient(pid) ON DELETE CASCADE,
	timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	heart_rate INT,
	sao2 INT,
	respiration INT
);

INSERT INTO 
	public.patient (firstname, lastname, age, gender, status)
VALUES 
	('Michael', 'Scott', 22, 'm', 0),
	('Dwight', 'Shrute', 25, 'm', 9),
	('Pam', 'Beesly', 32, 'f', 9),
	('Jim', 'Halpert', 27, 'm', 9),
	('Angela', 'Martin', 19, 'f', 9);
	
INSERT INTO
	public.vital (pid, timestamp, heart_rate, sao2, respiration)
VALUES
	(1, NOW() + INTERVAL '5 minutes', 77, 96, 21),
	(2, NOW() + INTERVAL '5 minutes', 68, 91, 32),
	(3, NOW() + INTERVAL '5 minutes', 101, 93, 18),
	(4, NOW() + INTERVAL '5 minutes', 83, 98, 25),
	(5, NOW() + INTERVAL '5 minutes', 82, 97, 21);
	
INSERT INTO
	public.vital (pid, timestamp, heart_rate, sao2, respiration)
VALUES
	(1, NOW() + INTERVAL '10 minutes', 78, 93, 26),
	(2, NOW() + INTERVAL '10 minutes', 74, 94, 25),
	(3, NOW() + INTERVAL '10 minutes', 102, 93, 16),
	(4, NOW() + INTERVAL '10 minutes', 77, 95, 31),
	(5, NOW() + INTERVAL '10 minutes', 91, 96, 23);
	
INSERT INTO
	public.vital (pid, timestamp, heart_rate, sao2, respiration)
VALUES
	(1, NOW() + INTERVAL '15 minutes', 84, 94, 26),
	(2, NOW() + INTERVAL '15 minutes', 73, 93, 31),
	(3, NOW() + INTERVAL '15 minutes', 102, 96, 18),
	(4, NOW() + INTERVAL '15 minutes', 73, 99, 20),
	(5, NOW() + INTERVAL '15 minutes', 72, 96, 19);

-- migrate:down
DROP TABLE IF EXISTS public.vital;