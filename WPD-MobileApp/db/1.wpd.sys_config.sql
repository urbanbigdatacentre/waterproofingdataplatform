DO $$
BEGIN
    INSERT INTO roles(name, active) VALUES ('ROLE_ADMIN', 1);
    INSERT INTO roles(name, active) VALUES ('ROLE_CLIENT', 1);

    INSERT INTO formsorigins(id, name, active) VALUES (DEFAULT, 'OFICIAL', 1);
    INSERT INTO formsorigins(id, name, active) VALUES (DEFAULT, 'WP6.MobileApp', 1);
    
    INSERT INTO fieldsdatatypes(id, name, description, active) VALUES (DEFAULT, 'integer', 'data type integer', 1);
    INSERT INTO fieldsdatatypes(id, name, description, active) VALUES (DEFAULT, 'text', 'data type text', 1);
    INSERT INTO fieldsdatatypes(id, name, description, active) VALUES (DEFAULT, 'real', 'data type real', 1);
    INSERT INTO fieldsdatatypes(id, name, description, active) VALUES (DEFAULT, 'timestamp', 'data type timestamp', 1);
    INSERT INTO fieldsdatatypes(id, name, description, active) VALUES (DEFAULT, 'geom', 'data type geometric', 1);
END $$;

--delete from formsfields;
--delete from fields;
--delete from forms;
--delete from fieldsdatatypes;
--delete from formsorigins;
