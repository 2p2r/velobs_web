-- phpMyAdmin SQL Dump
-- version 4.2.10
-- http://www.phpmyadmin.net
--
-- Client :  localhost:8889
-- Généré le :  Jeu 07 Janvier 2016 à 12:14
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
-- Structure de la table `subcategory`
--

CREATE TABLE `subcategory` (
`id_subcategory` int(11) NOT NULL,
  `lib_subcategory` varchar(100) DEFAULT NULL,
  `icon_subcategory` varchar(100) DEFAULT NULL,
  `treerank_subcategory` int(11) DEFAULT NULL,
  `display_subcategory` tinyint(1) DEFAULT NULL,
  `proppublic_subcategory` tinyint(1) DEFAULT NULL,
  `category_id_category` int(11) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8;

--
-- Index pour les tables exportées
--

--
-- Index pour la table `subcategory`
--
ALTER TABLE `subcategory`
 ADD PRIMARY KEY (`id_subcategory`), ADD KEY `category_id_category` (`category_id_category`);

--
-- AUTO_INCREMENT pour les tables exportées
--

--
-- AUTO_INCREMENT pour la table `subcategory`
--
ALTER TABLE `subcategory`
MODIFY `id_subcategory` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=20;
--
-- Contraintes pour les tables exportées
--

--
-- Contraintes pour la table `subcategory`
--
ALTER TABLE `subcategory`
ADD CONSTRAINT `subcategory_ibfk_1` FOREIGN KEY (`category_id_category`) REFERENCES `category` (`id_category`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
