CREATE TABLE IF NOT EXISTS auth.users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    nickname VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    dateofborn DATE NULL,
    gender CHAR(1) NULL,
    state CHAR(2) NOT NULL,
    city VARCHAR(255) NOT NULL,
    institutiontype CHAR(1) NULL,
    institution VARCHAR(255) NULL,
    securityquestion VARCHAR(255) NULL,
    securityanswer VARCHAR(255) NULL,
    termsofusage BOOLEAN NOT NULL,
    avatar VARCHAR(100) NULL,
    active INT NOT NULL
);

CREATE TABLE IF NOT EXISTS auth.forgotpassword_keys ( 
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    key VARCHAR(4) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS auth.forgotpassword_questions ( 
    id SERIAL PRIMARY KEY,
    question VARCHAR(255) NOT NULL,
    active INT NOT NULL
);

CREATE TABLE IF NOT EXISTS auth.forgotpassword_questions_users_answers ( 
    id SERIAL PRIMARY KEY,
    forgotpassword_questions_id INT NOT NULL,
    users_id INT NOT NULL,
    answer VARCHAR(255) NOT NULL,
    FOREIGN KEY (forgotpassword_questions_id) REFERENCES auth.forgotpassword_questions (id),
    FOREIGN KEY (users_id) REFERENCES auth.users (id)
);

CREATE TABLE IF NOT EXISTS auth.roles (
    id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    active INT NOT NULL
);

CREATE TABLE IF NOT EXISTS auth.users_roles ( 
    users_id INT NOT NULL,
    roles INT NOT NULL,
    FOREIGN KEY (users_id) REFERENCES auth.users (id)
);

CREATE TABLE IF NOT EXISTS auth.users_provider_activationkey ( 
    id SERIAL PRIMARY KEY,
    users_id INT NOT NULL,
    activationkey UUID UNIQUE NOT NULL,
    FOREIGN KEY (users_id) REFERENCES auth.users (id)
);

CREATE TABLE IF NOT EXISTS auth.educemaden_organizations (
    id INT PRIMARY KEY,
    active VARCHAR(20) NULL,
    name VARCHAR(255) NOT NULL,
    creation_date varchar(50) NULL,
    inep_code varchar(100) NULL,
    phone varchar(100) NOT NULL,
    type varchar(100) NULL,
    website varchar(255) NULL,
    login varchar(50) NULL,
    address varchar(255) NULL,
    responsible varchar(50) NULL,
    activationkey UUID UNIQUE NOT NULL DEFAULT uuid_generate_v4()
);

CREATE TABLE IF NOT EXISTS auth.users_educemaden_organizations ( 
    id SERIAL PRIMARY KEY,
    users_id INT NOT NULL,
    educemaden_organizations_id INT NOT NULL,
    activationkey UUID UNIQUE NOT NULL,
    FOREIGN KEY (users_id) REFERENCES auth.users (id)
);

--drop table auth.users_educemaden_organizations;
--drop table auth.educemaden_organizations;
--drop table auth.users_provider_activationkey;
--drop table auth.users_roles;
--drop table auth.roles;
--drop table auth.forgotpassword_questions_users_answers;
--drop table auth.forgotpassword_questions;
--drop table auth.forgotpassword_keys;
--drop table auth.users;
