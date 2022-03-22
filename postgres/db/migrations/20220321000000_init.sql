-- migrate:up

--
-- initialization script for predicting patient issues database.
--
-- NOTE: The script contains on delete triggers for all rows in the patient and vital tables.
-- !!! IMPORTANT !!! The columns in the archive tables must exactly match the original tables.
--

--
-- create tables
--

DROP TABLE IF EXISTS public.login;
DROP TABLE IF EXISTS public.user;
DROP TABLE IF EXISTS public.role;
DROP TABLE IF EXISTS public.rank;
DROP TABLE IF EXISTS public.vital;
DROP TABLE IF EXISTS public.patient;
DROP TABLE IF EXISTS public.status;
DROP TABLE IF EXISTS public.vital_archive;
DROP TABLE IF EXISTS public.patient_archive;

CREATE TABLE IF NOT EXISTS public.rank (
	id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	pay_grade VARCHAR(8),
	abbreviation VARCHAR(8) UNIQUE NOT NULL,
	name VARCHAR(64) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.role (
	id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	name VARCHAR(32) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS public.user (
	uid INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	firstname VARCHAR(64) NOT NULL,
	lastname VARCHAR(64) NOT NULL,
	username VARCHAR(64) UNIQUE NOT NULL,
	rank INT NOT NULL REFERENCES public.rank(id) ON DELETE SET NULL,
	role INT NOT NULL REFERENCES public.role(id) ON DELETE SET NULL,
    admin BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS public.login (
	uid INT PRIMARY KEY REFERENCES public.user(uid) ON DELETE CASCADE,
	password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.status (
	id INT PRIMARY KEY,
	text VARCHAR(16)
);

CREATE TABLE IF NOT EXISTS public.patient (
	pid INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	admit_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	firstname VARCHAR(64) NOT NULL,
	lastname VARCHAR(64) NOT NULL,
	age INT CONSTRAINT age_check CHECK (age > 0),
	gender VARCHAR(16) CONSTRAINT gender_check CHECK (gender IN ('Male', 'Female')),
	status INT NOT NULL REFERENCES public.status(id) DEFAULT 10
);

CREATE TABLE IF NOT EXISTS public.vital (
	pid INT REFERENCES public.patient(pid) ON DELETE CASCADE,
	timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	heart_rate INT,
	sao2 INT,
	respiration INT
);

CREATE TABLE IF NOT EXISTS public.patient_archive (
	pid INT PRIMARY KEY,
	admit_time TIMESTAMP,
	firstname VARCHAR(64) NOT NULL,
	lastname VARCHAR(64) NOT NULL,
	age INT CONSTRAINT age_check CHECK (age > 0),
	gender VARCHAR(16) CONSTRAINT gender_check CHECK (gender IN ('Male', 'Female')),
	status INT NOT NULL DEFAULT 10
		CONSTRAINT status_check CHECK (status IN (0, 9, 10))
);

CREATE TABLE IF NOT EXISTS public.vital_archive (
	pid INT REFERENCES public.patient_archive(pid) ON DELETE CASCADE,
	timestamp TIMESTAMP,
	heart_rate INT,
	sao2 INT,
	respiration INT
);

--
-- add on delete triggers to archive patient and vital information.
--

CREATE OR REPLACE FUNCTION archive_patient() RETURNS TRIGGER AS $archive_patient$
	BEGIN
		--
		-- Stores deleted row from patient into patient_archive
		--
		INSERT INTO 
			public.patient_archive(pid, admit_time, firstname, lastname, age, gender, status) 
		VALUES 
			(OLD.pid, OLD.admit_time, OLD.firstname, OLD.lastname, OLD.age, OLD.gender, OLD.status);
		RETURN NULL;
	END;
$archive_patient$ LANGUAGE plpgsql;

CREATE TRIGGER del_patient_trigger AFTER DELETE ON public.patient
FOR EACH ROW EXECUTE PROCEDURE archive_patient();

CREATE OR REPLACE FUNCTION archive_vital() RETURNS TRIGGER AS $archive_vital$
	BEGIN
	--
	-- Stores deleted row from vital into vital_archive
	--
		INSERT INTO
			public.vital_archive(pid, timestamp, heart_rate, sao2, respiration)
		VALUES
			(OLD.pid, OLD.timestamp, OLD.heart_rate, OLD.sao2, OLD.respiration);
		RETURN NULL;
	END;
$archive_vital$ LANGUAGE plpgsql;

CREATE TRIGGER del_vital_trigger AFTER DELETE ON public.vital
FOR EACH ROW EXECUTE PROCEDURE archive_vital();

--
-- populate tables with initial values.
--

INSERT INTO 
	public.rank (pay_grade, abbreviation, name) 
VALUES 
	(NULL, 'CIV', 'Civilian'),
	(NULL, 'NA', 'Other'),

	('E1', 'SR', 'Seaman Recruit'),
	('E2', 'SA', 'Seaman Apprentice'),
	('E3', 'SN', 'Seaman'),
	('E4', 'PO3', 'Petty Officer Third Class'),
	('E5', 'PO2', 'Petty Officer Second Class'),
	('E6', 'PO1', 'Petty Officer First Class'),
	('E7', 'CPO', 'Chief Petty Officer'),
	('E8', 'SCPO', 'Senior Chief Petty Officer'),
	('E9', 'MCPO', 'Master Chief Petty Officer'),
	('E9', 'CMDCM', 'Command Master Chief Petty Officer'),
	('E9', 'MCPON', 'Master Chief Petty Officer Of The Navy'),
	
	('W2', 'CWO2', 'Chief Warrant Officer 2'),
	('W3', 'CWO3', 'Chief Warrant Officer 3'),
	('W4', 'CWO4', 'Chief Warrant Officer 4'),
	('W5', 'CWO5', 'Chief Warrant Officer 5'),
	('O1', 'ENS', 'Ensign'),
	('O2', 'LTJG', 'Lieutenant, Junior Grade'),
	('O3', 'LT', 'Lieutenant'),
	('O4', 'LCDR', 'Lieutenant Commander'),
	('O5', 'CDR', 'Commander'),
	('O6', 'CAPT', 'Captain'),
	
	('O7', 'RDML', 'Rear Admiral Lower Half'),
	('O8', 'RADM', 'Rear Admiral Upper Half'),
	('O9', 'VADM', 'Vice Admiral'),
	('O10', 'ADM', 'Admiral'),
	('O11', 'FADM', 'Fleet Admiral');

INSERT INTO 
	public.role (name)
VALUES
	('NA'),
	('Surgery'),
	('Nurse');

INSERT INTO
	public.user (firstname, lastname, username, rank, role, admin)
VALUES
	('john', 'smith', 'admin', 1, 1, TRUE),
    ('jane', 'doe', 'jdoe', 9, 2, FALSE);

INSERT INTO
	public.login (uid, password)
VALUES
	(1, '$2b$12$45/YP2Jh5ItgCyySRVy4fu3J1NoOX/8BXIq/h6/JR1YA7MIsa3tLy'),
    (2, '$2b$12$45/YP2Jh5ItgCyySRVy4fu3J1NoOX/8BXIq/h6/JR1YA7MIsa3tLy');

INSERT INTO public.status(id, text)
VALUES
	(1, 'Critical'),
	(9, 'Stable'),
	(10, 'Unobserved');

INSERT INTO 
	public.patient (firstname, lastname, age, gender, status)
VALUES 
	('Michael', 'Scott', 22, 'Male', 1),
	('Dwight', 'Shrute', 25, 'Male', 9),
	('Pam', 'Beesly', 32, 'Female', 9),
	('Jim', 'Halpert', 27, 'Male', 9),
	('Angela', 'Martin', 19, 'Female', 9);

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