-- phpMyAdmin SQL Dump
-- version 3.3.10deb1
-- http://www.phpmyadmin.net
--
-- Serveur: localhost
-- Généré le : Dim 10 Janvier 2016 à 12:02
-- Version du serveur: 5.1.63
-- Version de PHP: 5.3.5-1ubuntu7.11

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de données: `velobs`
--

-- --------------------------------------------------------

--
-- Structure de la table `poi`
--

CREATE TABLE IF NOT EXISTS `poi` (
  `id_poi` int(11) NOT NULL AUTO_INCREMENT,
  `lib_poi` varchar(100) DEFAULT NULL,
  `adherent_poi` varchar(100) DEFAULT NULL,
  `rue_poi` varchar(100) DEFAULT NULL,
  `num_poi` varchar(100) DEFAULT NULL,
  `mail_poi` varchar(100) DEFAULT NULL,
  `tel_poi` varchar(100) DEFAULT NULL,
  `geom_poi` geometry DEFAULT NULL,
  `desc_poi` text,
  `prop_poi` text,
  `display_poi` tinyint(1) DEFAULT NULL,
  `fix_poi` tinyint(1) DEFAULT NULL,
  `moderation_poi` tinyint(1) DEFAULT NULL,
  `datecreation_poi` date DEFAULT NULL,
  `datefix_poi` date DEFAULT NULL,
  `photo_poi` varchar(100) DEFAULT NULL,
  `geolocatemode_poi` int(11) DEFAULT NULL,
  `subcategory_id_subcategory` int(11) DEFAULT NULL,
  `commune_id_commune` int(11) DEFAULT NULL,
  `pole_id_pole` int(11) DEFAULT NULL,
  `quartier_id_quartier` int(11) DEFAULT NULL,
  `priorite_id_priorite` int(11) DEFAULT NULL,
  `observationterrain_poi` text,
  `reponsegrandtoulouse_poi` text,
  `commentfinal_poi` text,
  `status_id_status` int(11) DEFAULT NULL,
  `transmission_poi` tinyint(1) DEFAULT NULL,
  `traiteparpole_poi` tinyint(1) DEFAULT NULL,
  `reponsepole_poi` text,
  `mailsentuser_poi` tinyint(1) DEFAULT '0',
  `delete_poi` tinyint(1) DEFAULT '0',
  `lastdatemodif_poi` date NOT NULL,
  PRIMARY KEY (`id_poi`),
  KEY `subcategory_id_subcategory` (`subcategory_id_subcategory`),
  KEY `commune_id_commune` (`commune_id_commune`),
  KEY `pole_id_pole` (`pole_id_pole`),
  KEY `quartier_id_quartier` (`quartier_id_quartier`),
  KEY `priorite_id_priorite` (`priorite_id_priorite`),
  KEY `status_id_status` (`status_id_status`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2325 ;

--
-- Contraintes pour les tables exportées
--

--
-- Contraintes pour la table `poi`
--
ALTER TABLE `poi`
  ADD CONSTRAINT `poi_ibfk_1` FOREIGN KEY (`subcategory_id_subcategory`) REFERENCES `subcategory` (`id_subcategory`),
  ADD CONSTRAINT `poi_ibfk_2` FOREIGN KEY (`commune_id_commune`) REFERENCES `commune` (`id_commune`),
  ADD CONSTRAINT `poi_ibfk_3` FOREIGN KEY (`pole_id_pole`) REFERENCES `pole` (`id_pole`),
  ADD CONSTRAINT `poi_ibfk_4` FOREIGN KEY (`quartier_id_quartier`) REFERENCES `quartier` (`id_quartier`),
  ADD CONSTRAINT `poi_ibfk_5` FOREIGN KEY (`priorite_id_priorite`) REFERENCES `priorite` (`id_priorite`),
  ADD CONSTRAINT `poi_ibfk_6` FOREIGN KEY (`status_id_status`) REFERENCES `status` (`id_status`);
