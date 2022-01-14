CREATE TABLE IF NOT EXISTS public.roles (
	id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	name VARCHAR(32) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS public.users (
	uid INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	firstname VARCHAR(64) NOT NULL,
	lastname VARCHAR(64) NOT NULL,
	username VARCHAR(64) UNIQUE NOT NULL,
	rank VARCHAR(4),
	role integer REFERENCES public.roles(id)
);

CREATE TABLE IF NOT EXISTS public.login (
	uid INT PRIMARY KEY REFERENCES public.users(uid),
	password VARCHAR(255) NOT NULL
);

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
	public.roles (name)
VALUES
	('surgery'),
	('nurse');
	
INSERT INTO
	public.users (firstname, lastname, username, rank, role)
VALUES
	('jane', 'doe', 'jdoe', 'LT', 1);
	
INSERT INTO
	public.login (uid, password)
VALUES
	(1, '$2b$12$45/YP2Jh5ItgCyySRVy4fu3J1NoOX/8BXIq/h6/JR1YA7MIsa3tLy');

INSERT INTO 
	public.patient (firstname, lastname, age, gender, status)
VALUES 
	('Michael', 'Scott', 22, 'm', 'critical'),
	('Dwight', 'Shrute', 25, 'm', 'stable'),
	('Pam', 'Beesly', 32, 'f', 'stable'),
	('Jim', 'Halpert', 27, 'm', 'stable'),
	('Angela', 'Martin', 19, 'f', 'stable');