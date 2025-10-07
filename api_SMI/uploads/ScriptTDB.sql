create database TDB;

\c TDB;

create table processus (
    id int serial primary key,
    nom varchar(50)
);

create table objectif (
    id int serial primary key,
    descr text,
    id_processus int
);

create table indicateur (
    id int serial primary key,
    descr text,
    id_objectif int,
    annee year
);

create table cible (
    id int serial primary key,
    descr text,
    valeur_min DECIMAL(10,0),
    valeur_max DECIMAL(10,0),
    valeur_optimal DECIMAL(10,0),
    id_indicateur int
);

create table frequence (
    id int serial primary key,
    nom varchar(50),
    descr text,
    pas_en_mois int
);

create table periode (
    id int serial primary key,
    nom varchar(50),
    mois_debut int,
    mois_fin int,
    ordre int,
    id_frequence int
);

create table mois (
    id int serial primary key,
    nom varchar(50),
    numero int,
    date_mois month
);

create table valeur (
    id int serial primary key,
    id_indicateur int,
    valeur DECIMAL(10,0),
    id_periode int,
    date_insertion date
);

create table unite (
    id int serial primary key,
    nom varchar(20)
);