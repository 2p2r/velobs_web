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
-- Structure de la table `poi_commentaires`
--

CREATE TABLE IF NOT EXISTS `poi_commentaires` (
  `poi_id_poi` int(11) DEFAULT NULL,
  `commentaires_id_commentaires` int(11) DEFAULT NULL,
  KEY `poi_id_poi` (`poi_id_poi`),
  KEY `commentaires_id_commentaires` (`commentaires_id_commentaires`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contraintes pour les tables exportées
--

--
-- Contraintes pour la table `poi_commentaires`
--
ALTER TABLE `poi_commentaires`
  ADD CONSTRAINT `poi_commentaires_ibfk_1` FOREIGN KEY (`poi_id_poi`) REFERENCES `poi` (`id_poi`),
  ADD CONSTRAINT `poi_commentaires_ibfk_2` FOREIGN KEY (`commentaires_id_commentaires`) REFERENCES `commentaires` (`id_commentaires`);
