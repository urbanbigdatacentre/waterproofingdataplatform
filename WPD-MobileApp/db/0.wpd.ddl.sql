CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NULL,
    firstname VARCHAR(100) NULL,
    surname VARCHAR(100) NULL,
    avatar VARCHAR(100) NULL,
    active INT NOT NULL
);

CREATE TABLE IF NOT EXISTS roles
(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    active INT NOT NULL
);

CREATE TABLE IF NOT EXISTS users_roles
(
    users_id INT NOT NULL,
    roles INT NOT NULL,
    FOREIGN KEY (users_id) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS formsorigins
(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    active INT NOT NULL
);

CREATE TABLE IF NOT EXISTS forms
(
    id SERIAL PRIMARY KEY,
    idformsorigins INT NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(100) NOT NULL,
    dtcreation TIMESTAMP NOT NULL DEFAULT NOW(),
    active INT NOT NULL,
    source VARCHAR(100) NOT NULL,
    FOREIGN KEY (idformsorigins) REFERENCES formsorigins (id)
);

CREATE TABLE IF NOT EXISTS fieldsdatatypes
(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(100) NOT NULL,
    active INT NOT NULL
);

CREATE TABLE IF NOT EXISTS fields
(
    id SERIAL PRIMARY KEY,
    idfieldsdatatypes INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(100) NOT NULL,
    fillingclue VARCHAR(100) NOT NULL,
    active INT NOT NULL,
    FOREIGN KEY (idfieldsdatatypes) REFERENCES fieldsdatatypes (id)
);

CREATE TABLE IF NOT EXISTS formsfields
(
    id SERIAL PRIMARY KEY,
    idforms INT NOT NULL,
    idfields INT NOT NULL,
    active INT NOT NULL,
    FOREIGN KEY (idforms) REFERENCES forms (id),
    FOREIGN KEY (idfields) REFERENCES fields (id)
);

CREATE TABLE IF NOT EXISTS alternatives
(
    id SERIAL PRIMARY KEY,
    response VARCHAR(100) NOT NULL,
    shortresponse VARCHAR(100) NOT NULL,
    description VARCHAR(100) NOT NULL,
    active INT NOT NULL
);

CREATE TABLE IF NOT EXISTS fieldsalternatives
(
    id SERIAL PRIMARY KEY,
    idfields INT NOT NULL,
    idalternatives INT NOT NULL,
    active INT NOT NULL,
    FOREIGN KEY (idfields) REFERENCES fields (id),
    FOREIGN KEY (idalternatives) REFERENCES alternatives (id)
);

CREATE TABLE IF NOT EXISTS formsanswers
(
    id SERIAL PRIMARY KEY,
    idforms INT NOT NULL,
    idusersinformer INT NOT NULL,
    dtfilling TIMESTAMP NOT NULL,
    latitude NUMERIC NULL,
    longitude NUMERIC NULL,
    FOREIGN KEY (idforms) REFERENCES forms (id),
    FOREIGN KEY (idusersinformer) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS fieldsanswers
(
    id SERIAL PRIMARY KEY,
    idfields INT NOT NULL,
    idformsanswers INT NOT NULL,
    value VARCHAR(100) NULL,
    FOREIGN KEY (idfields) REFERENCES fields (id),
    FOREIGN KEY (idformsanswers) REFERENCES formsanswers (id)
);
SELECT AddGeometryColumn('','fieldsanswers','geom','4326','MULTIPOLYGON',2);

CREATE TABLE IF NOT EXISTS usersendorsementfieldsanswers
(
    id SERIAL PRIMARY KEY,
    idusersendorsement INT NOT NULL,
    idfieldsanswers INT NOT NULL,
    latitude NUMERIC NULL,
    longitude NUMERIC NULL,
    istrustable INT NOT NULL,
    active INT NOT NULL,
    FOREIGN KEY (idusersendorsement) REFERENCES users (id),
    FOREIGN KEY (idfieldsanswers) REFERENCES fieldsanswers (id)
);

CREATE TABLE IF NOT EXISTS preliminarydata
(
    id SERIAL PRIMARY KEY,
    idfieldsanswers INT NOT NULL,
    dtinsert TIMESTAMP NOT NULL,
    active INT NOT NULL,
    FOREIGN KEY (idfieldsanswers) REFERENCES fieldsanswers (id)
);

CREATE TABLE IF NOT EXISTS trusteddata
(
    id SERIAL PRIMARY KEY,
    idfieldsanswers INT NOT NULL,
    dtinsert TIMESTAMP NOT NULL,
    active INT NOT NULL,
    FOREIGN KEY (idfieldsanswers) REFERENCES fieldsanswers (id)
);
