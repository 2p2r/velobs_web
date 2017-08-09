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
-- Structure de la table `iconmarker`
--

CREATE TABLE `iconmarker` (
`id_iconmarker` int(11) NOT NULL,
  `name_iconmarker` varchar(100) DEFAULT NULL,
  `urlname_iconmarker` varchar(100) DEFAULT NULL,
  `color_iconmarker` varchar(100) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8;

--
-- Contenu de la table `iconmarker`
--

INSERT INTO `iconmarker` (`id_iconmarker`, `name_iconmarker`, `urlname_iconmarker`, `color_iconmarker`) VALUES
(1, 'Musée', 'iconmarker1', ''),
(2, 'Vélo', 'iconmarker2', ''),
(3, 'Médical', 'iconmarker3', ''),
(4, 'VTT', 'iconmarker4', ''),
(5, 'bordures', 'iconmarker5', ''),
(6, 'test', 'iconmarker6', ''),
(7, 'tourne', 'iconmarker7', ''),
(8, 'support vélo', 'iconmarker8', ''),
(9, 'tourne à droite', 'iconmarker9', ''),
(10, 'chicane', 'iconmarker10', ''),
(11, 'chicane2', 'iconmarker11', ''),
(12, 'bordures2', 'iconmarker12', ''),
(13, 'Jalonnement', 'iconmarker13', ''),
(14, 'bordures3', 'iconmarker14', ''),
(15, 'absence', 'iconmarker15', ''),
(16, 'supports', 'iconmarker16', ''),
(17, 'defaut d''entretien', 'iconmarker17', ''),
(18, 'chicanes', 'iconmarker18', ''),
(19, 'tourne Ã  droite 2', 'iconmarker19', '');

--
-- Index pour les tables exportées
--

--
-- Index pour la table `iconmarker`
--
ALTER TABLE `iconmarker`
 ADD PRIMARY KEY (`id_iconmarker`);

--
-- AUTO_INCREMENT pour les tables exportées
--

--
-- AUTO_INCREMENT pour la table `iconmarker`
--
ALTER TABLE `iconmarker`
MODIFY `id_iconmarker` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=20;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
