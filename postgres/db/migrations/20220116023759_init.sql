-- migrate:up

CREATE TABLE IF NOT EXISTS public.role (
	id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	name VARCHAR(32) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS public.user (
	uid INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	firstname VARCHAR(64) NOT NULL,
	lastname VARCHAR(64) NOT NULL,
	username VARCHAR(64) UNIQUE NOT NULL,
	rank VARCHAR(4),
	role integer REFERENCES public.role(id)
);

CREATE TABLE IF NOT EXISTS public.login (
	uid INT PRIMARY KEY REFERENCES public.user(uid),
	password VARCHAR(255) NOT NULL
);

INSERT INTO 
	public.role (name)
VALUES
	('surgery'),
	('nurse');
	
INSERT INTO
	public.user (firstname, lastname, username, rank, role)
VALUES
	('jane', 'doe', 'jdoe', 'LT', 1);

INSERT INTO
	public.login (uid, password)
VALUES
	(1, '$2b$12$45/YP2Jh5ItgCyySRVy4fu3J1NoOX/8BXIq/h6/JR1YA7MIsa3tLy');

-- migrate:down

