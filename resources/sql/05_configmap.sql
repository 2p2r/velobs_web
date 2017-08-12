-- phpMyAdmin SQL Dump
-- version 4.2.10
-- http://www.phpmyadmin.net
--
-- Client :  localhost:8889
-- Généré le :  Jeu 07 Janvier 2016 à 12:16
-- Version du serveur :  5.5.38
-- Version de PHP :  5.6.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de données :  `velobs`
--

-- --------------------------------------------------------

--
-- Structure de la table `configmap`
--

CREATE TABLE `configmap` (
`id_configmap` int(11) NOT NULL,
  `lat_configmap` float DEFAULT NULL,
  `lon_configmap` float DEFAULT NULL,
  `zoom_configmap` int(11) DEFAULT NULL,
  `baselayer_configmap` int(11) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Contenu de la table `configmap`
--

INSERT INTO `configmap` (`id_configmap`, `lat_configmap`, `lon_configmap`, `zoom_configmap`, `baselayer_configmap`) VALUES
(1, 43.6032, 1.4321, 13, 0);

--
-- Index pour les tables exportées
--

--
-- Index pour la table `configmap`
--
ALTER TABLE `configmap`
 ADD PRIMARY KEY (`id_configmap`);

--
-- AUTO_INCREMENT pour les tables exportées
--

--
-- AUTO_INCREMENT pour la table `configmap`
--
ALTER TABLE `configmap`
MODIFY `id_configmap` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
