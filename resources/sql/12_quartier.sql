-- phpMyAdmin SQL Dump
-- version 4.2.10
-- http://www.phpmyadmin.net
--
-- Client :  localhost:8889
-- Généré le :  Jeu 07 Janvier 2016 à 12:20
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
-- Structure de la table `quartier`
--

CREATE TABLE `quartier` (
`id_quartier` int(11) NOT NULL,
  `lib_quartier` varchar(100) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=100000 DEFAULT CHARSET=utf8;

--
-- Contenu de la table `quartier`
--

INSERT INTO `quartier` (`id_quartier`, `lib_quartier`) VALUES
(1, 'Hors Toulouse'),
(2, 'Baluffet'),
(3, 'Bellefontaine'),
(4, 'Bonnefoy'),
(5, 'Borderouge'),
(6, 'Casselardit'),
(7, 'Cépiere - Les Arènes'),
(8, 'Cité de l''Hers'),
(9, 'Côte Pavée'),
(10, 'Croix de Pierre'),
(11, 'Croix-Daurade'),
(12, 'Empalot'),
(13, 'Ginestous'),
(14, 'Gramont'),
(15, 'Guilhemery'),
(16, 'Hyper-centre'),
(17, 'Jolimont'),
(18, 'La Faourette'),
(19, 'La Roseraie'),
(20, 'La Terrasse'),
(21, 'Lalande'),
(22, 'Langlade'),
(23, 'Lardenne'),
(24, 'Le Chapitre'),
(25, 'Les Amidonniers'),
(26, 'Les Izards'),
(27, 'Les Pradettes'),
(28, 'Minimes'),
(29, 'Mirail-Université'),
(30, 'Montaudran'),
(31, 'Palays'),
(32, 'Pont des Demoiselles'),
(33, 'Pouvourville'),
(34, 'Purpan'),
(35, 'Rangueil / Saint-Agne'),
(36, 'Rangueil Université'),
(37, 'Reynerie'),
(38, 'Saint-Cyprien'),
(39, 'Saint-Martin-du-Touch'),
(40, 'Saint-Michel - Busca'),
(41, 'Saint-Simon'),
(42, 'Sept-Deniers'),
(43, 'Soupetard'),
(99999, 'Inutile');

--
-- Index pour les tables exportées
--

--
-- Index pour la table `quartier`
--
ALTER TABLE `quartier`
 ADD PRIMARY KEY (`id_quartier`);

--
-- AUTO_INCREMENT pour les tables exportées
--

--
-- AUTO_INCREMENT pour la table `quartier`
--
ALTER TABLE `quartier`
MODIFY `id_quartier` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=100000;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
