-- migrate:up

ALTER TABLE public.user
    ADD COLUMN admin BOOLEAN DEFAULT FALSE;

INSERT INTO
	public.user (firstname, lastname, username, rank, role, admin)
VALUES
	('admin', 'admin', 'admin', 'LT', 1, TRUE);

INSERT INTO
	public.login (uid, password)
VALUES
	(2, '$2b$12$45/YP2Jh5ItgCyySRVy4fu3J1NoOX/8BXIq/h6/JR1YA7MIsa3tLy');

-- migrate:down