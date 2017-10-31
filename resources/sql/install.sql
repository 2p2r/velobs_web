-- phpMyAdmin SQL Dump
-- version 4.2.10
-- http://www.phpmyadmin.net
--
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
-- Structure de la table `category`
--

CREATE TABLE `category` (
`id_category` int(11) NOT NULL,
  `lib_category` varchar(100) DEFAULT NULL,
  `icon_category` varchar(100) DEFAULT NULL,
  `treerank_category` int(11) DEFAULT NULL,
  `display_category` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

--
-- Contenu de la table `category`
--
INSERT INTO `category` (`id_category`, `lib_category`, `icon_category`, `treerank_category`, `display_category`) VALUES
(1, 'Observations', 'iconmarker2', 1, 1);
--
-- Index pour les tables exportées
--

--
-- Index pour la table `category`
--
ALTER TABLE `category`
 ADD PRIMARY KEY (`id_category`);

--
-- AUTO_INCREMENT pour les tables exportées
--

--
-- AUTO_INCREMENT pour la table `category`
--
ALTER TABLE `category`
MODIFY `id_category` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=4;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
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
INSERT INTO `subcategory` (`id_subcategory`, `lib_subcategory`, `icon_subcategory`, `treerank_subcategory`, `display_subcategory`, `proppublic_subcategory`, `category_id_category`) VALUES
(2, 'Aménagement mal conçu', 'iconmarker2', 0, 1, 1, 1),
(3, 'Défaut d''entretien ou détériorations', 'iconmarker17', 0, 1, 1, 1),
(4, 'Point noir, absence d''aménagement', 'iconmarker15', 0, 1, 1, 1),
(14, 'Chicanes', 'iconmarker18', 3, 1, 1, 1),
(15, 'Bordures', 'iconmarker14', 4, 1, 1, 1),
(16, 'Stationnement gênant', 'iconmarker3', 2, 1, 1, 1),
(17, 'Tourne à droite => laissez passer cyclistes', 'iconmarker19', 1, 1, 1, 1),
(18, 'Supports vélo', 'iconmarker16', 0, 1, 1, 1),
(19, 'Jalonnement', 'iconmarker13', 0, 1, 1, 1);
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
-- phpMyAdmin SQL Dump
-- version 4.2.10
-- http://www.phpmyadmin.net
--
-- Client :  localhost:8889
-- Généré le :  Jeu 07 Janvier 2016 à 12:19
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
-- Structure de la table `territoire`
--

CREATE TABLE `territoire` (
  `id_territoire` int(11) NOT NULL,
  `lib_territoire` varchar(255) NOT NULL,
  `type_territoire` int(11) NOT NULL,
  `ids_territoire` varchar(4096) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contenu de la table `territoire`
--

INSERT INTO `territoire` (`id_territoire`, `lib_territoire`, `type_territoire`, `ids_territoire`) VALUES
(0, 'Zone couverte par VelObs', 0, ''),
(1, 'Toulouse Metropole', 0, '31555;31003;31022;31032;31044;31053;31056;31069;31088;31091;31116;31149;31150;31157;31163;31182;31184;31186;31205;31230;31282;31293;31351;31352;31355;31389;31417;31418;31445;31467;31488;31490;31506;31541;31557;31561;31588'),
(2, 'Sicoval', 0, '31254;31025;31035;31036;31004;31048;31057;31058;31113;31148;31151;31161;31162;31169;31171;31192;31227;31240;31249;31259;31284;31340;31366;31381;31384;31401;31402;31409;31411;31429;31437;31446;31448;31568;31575;31578'),
(3, 'Muretain', 0, '31395;31187;31165;31253;31287;31181;31486;31533;31499;31475;31248;31420;31421;31433;31460;31580');

--
-- Index pour les tables exportées
--

--
-- Index pour la table `territoire`
--
ALTER TABLE `territoire`
 ADD PRIMARY KEY (`id_territoire`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
-- phpMyAdmin SQL Dump
-- version 4.2.10
-- http://www.phpmyadmin.net
--
-- Client :  localhost:8889
-- Généré le :  Jeu 07 Janvier 2016 à 12:19
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
-- Structure de la table `pole`
--

CREATE TABLE `pole` (
  `id_pole` int(11) NOT NULL DEFAULT '0',
  `lib_pole` varchar(100) DEFAULT NULL,
  `geom_pole` geometry DEFAULT NULL,
  `territoire_id_territoire` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contenu de la table `pole`
--

INSERT INTO `pole` (`id_pole`, `lib_pole`, `geom_pole`, `territoire_id_territoire`) VALUES
(9, 'Hors zone urbaine', NULL, 0),
(12, 'Administrateur ou comcom', NULL, 0);

--
-- Index pour les tables exportées
--

--
-- Index pour la table `pole`
--
ALTER TABLE `pole`
 ADD PRIMARY KEY (`id_pole`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
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
-- phpMyAdmin SQL Dump
-- version 4.2.10
-- http://www.phpmyadmin.net
--
-- Client :  localhost:8889
-- Généré le :  Jeu 07 Janvier 2016 à 12:17
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
-- Structure de la table `language`
--

CREATE TABLE `language` (
`id_language` int(11) NOT NULL,
  `lib_language` varchar(100) DEFAULT NULL,
  `extension_language` varchar(10) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

--
-- Contenu de la table `language`
--

INSERT INTO `language` (`id_language`, `lib_language`, `extension_language`) VALUES
(1, 'France', 'fr'),
(2, 'English', 'en');

--
-- Index pour les tables exportées
--

--
-- Index pour la table `language`
--
ALTER TABLE `language`
 ADD PRIMARY KEY (`id_language`);

--
-- AUTO_INCREMENT pour les tables exportées
--

--
-- AUTO_INCREMENT pour la table `language`
--
ALTER TABLE `language`
MODIFY `id_language` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
-- phpMyAdmin SQL Dump
-- version 4.2.10
-- http://www.phpmyadmin.net
--
-- Client :  localhost:8889
-- Généré le :  Jeu 07 Janvier 2016 à 12:21
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
-- Structure de la table `translation`
--

CREATE TABLE `translation` (
`id_translation` int(11) NOT NULL,
  `code_translation` varchar(50) DEFAULT NULL,
  `lib_translation` varchar(250) DEFAULT NULL,
  `language_id_language` int(11) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8;

--
-- Contenu de la table `translation`
--

INSERT INTO `translation` (`id_translation`, `code_translation`, `lib_translation`, `language_id_language`) VALUES
(1, 'DISCONNECT', 'Déconnexion', 1),
(2, 'DISCONNECT', 'Disconnect', 2),
(3, 'OPENPUBLICMAP', 'Prévisualiser la carte publique', 1),
(4, 'OPENPUBLICMAP', 'Display public map', 2),
(5, 'HELLO', 'Bonjour', 1),
(6, 'HELLO', 'Hello', 2),
(7, 'CLICKOPENUSERPREFERENCE', 'Cliquez pour ouvrir vos préférences', 1),
(8, 'CLICKOPENUSERPREFERENCE', 'Click to open your preferences', 2),
(9, 'ICONPNG', 'Seule l''extension png est autorisée.', 1),
(10, 'ICONPNG', 'Only the png extension is allowed.', 2),
(11, 'ICONSIZE', 'La taille de l''image ne doit pas dépasser 50 Ko !', 1),
(12, 'ICONSIZE', 'The image size should not exceed 50 KB!', 2),
(13, 'ERROR', 'Erreur', 1),
(14, 'ERROR', 'Error', 2),
(15, 'ICONSIZEPIXEL', 'La taille de l''icône doit être de 32 pixels en largeur et 37 pixels en hauteur.', 1),
(16, 'ICONSIZEPIXEL', 'The icon size should be 32 pixels wide by 37 pixels high.', 2),
(17, 'ICONTRANSFERTDONE', 'Le transfert de l''image a réussi.', 1),
(18, 'ICONTRANSFERTDONE', 'The image transfer was successful.', 2),
(19, 'ICONTRANSFERTFALSE', 'Le transfert a échoué. Veuillez contacter l''administrateur.', 1),
(20, 'ICONTRANSFERTFALSE', 'The transfer failed. Please contact the administrator.', 2),
(21, 'PICTUREPNGGIFJPGJPEG', 'Seules les extensions png, gif, jpg et jpeg sont autorisées.', 1),
(22, 'PICTUREPNGGIFJPGJPEG', 'Only extensions png, gif, jpg and jpeg are allowed.', 2),
(23, 'PICTURESIZE', 'La taille de la photo ne doit pas dépasser 1 Mo !', 1),
(24, 'PICTURESIZE', 'The image size should not exceed 1 MB!', 2),
(25, 'PHOTOTRANSFERTDONE', 'Le transfert de la photo a réussi.', 1),
(26, 'PHOTOTRANSFERTDONE', 'The transfer of the photo was successful.', 2),
(27, 'MADEBYMOOVEATIS', 'Mooveatis', 1),
(28, 'MADEBYMOOVEATIS', 'Mooveatis', 2);

--
-- Index pour les tables exportées
--

--
-- Index pour la table `translation`
--
ALTER TABLE `translation`
 ADD PRIMARY KEY (`id_translation`), ADD KEY `language_id_language` (`language_id_language`);

--
-- AUTO_INCREMENT pour les tables exportées
--

--
-- AUTO_INCREMENT pour la table `translation`
--
ALTER TABLE `translation`
MODIFY `id_translation` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=29;
--
-- Contraintes pour les tables exportées
--

--
-- Contraintes pour la table `translation`
--
ALTER TABLE `translation`
ADD CONSTRAINT `translation_ibfk_1` FOREIGN KEY (`language_id_language`) REFERENCES `language` (`id_language`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
-- phpMyAdmin SQL Dump
-- version 4.2.10
-- http://www.phpmyadmin.net
--
-- Client :  localhost:8889
-- Généré le :  Jeu 07 Janvier 2016 à 12:15
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
-- Structure de la table `commune`
--

CREATE TABLE `commune` (
  `id_commune` int(11) NOT NULL DEFAULT '0',
  `lib_commune` varchar(100) DEFAULT NULL,
  `geom_commune` geometry DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contenu de la table `commune`
--

INSERT INTO `commune` (`id_commune`, `lib_commune`, `geom_commune`) VALUES (99999, 'Autre commune', NULL);

--
-- Index pour les tables exportées
--

--
-- Index pour la table `commune`
--
ALTER TABLE `commune`
 ADD PRIMARY KEY (`id_commune`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
-- phpMyAdmin SQL Dump
-- version 4.2.10
-- http://www.phpmyadmin.net
--
-- Client :  localhost:8889
-- Généré le :  Jeu 07 Janvier 2016 à 12:21
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
-- Structure de la table `usertype`
--

CREATE TABLE `usertype` (
`id_usertype` int(11) NOT NULL,
  `lib_usertype` varchar(100) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

--
-- Contenu de la table `usertype`
--

INSERT INTO `usertype` (`id_usertype`, `lib_usertype`) VALUES
(1, 'Administrateur'),
(2, 'Comcom'),
(3, 'Pole technique'),
(4, 'Responsable pole 2p2r');

--
-- Index pour les tables exportées
--

--
-- Index pour la table `usertype`
--
ALTER TABLE `usertype`
 ADD PRIMARY KEY (`id_usertype`);

--
-- AUTO_INCREMENT pour les tables exportées
--

--
-- AUTO_INCREMENT pour la table `usertype`
--
ALTER TABLE `usertype`
MODIFY `id_usertype` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=5;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
-- phpMyAdmin SQL Dump
-- version 4.2.10
-- http://www.phpmyadmin.net
--
-- Client :  localhost:8889
-- Généré le :  Jeu 07 Janvier 2016 à 12:21
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
-- Structure de la table `users`
--

CREATE TABLE `users` (
`id_users` int(11) NOT NULL,
  `lib_users` varchar(100) DEFAULT NULL,
  `pass_users` varchar(100) DEFAULT NULL,
  `num_pole` int(11) NOT NULL,
  `usertype_id_usertype` int(11) DEFAULT NULL,
  `language_id_language` int(11) DEFAULT NULL,
  `territoire_id_territoire` int(11) DEFAULT NULL,
  `mail_users` varchar(255) NOT NULL,
  `nom_users` varchar(255) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

INSERT INTO `users` (`id_users`, `lib_users`, `pass_users`, `num_pole`, `usertype_id_usertype`, `language_id_language`, `territoire_id_territoire`, `mail_users`, `nom_users`) VALUES
(1, 'admin', 'admin', 12, 1, 1, 0, 'test@velobs.org', 'Administrateur VelObs');
--
-- Index pour les tables exportées
--

--
-- Index pour la table `users`
--
ALTER TABLE `users`
 ADD PRIMARY KEY (`id_users`), ADD KEY `usertype_id_usertype` (`usertype_id_usertype`), ADD KEY `language_id_language` (`language_id_language`), ADD KEY `territoire_id_territoire` (`territoire_id_territoire`);

--
-- AUTO_INCREMENT pour les tables exportées
--

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
MODIFY `id_users` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- Contraintes pour les tables exportées
--

--
-- Contraintes pour la table `users`
--
ALTER TABLE `users`
ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`usertype_id_usertype`) REFERENCES `usertype` (`id_usertype`) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT `users_ibfk_2` FOREIGN KEY (`language_id_language`) REFERENCES `language` (`id_language`) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT `users_ibfk_3` FOREIGN KEY (`territoire_id_territoire`) REFERENCES `territoire` (`id_territoire`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
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
-- Structure de la table `priorite`
--

CREATE TABLE `priorite` (
`id_priorite` int(11) NOT NULL,
  `lib_priorite` varchar(100) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;

--
-- Contenu de la table `priorite`
--

INSERT INTO `priorite` (`id_priorite`, `lib_priorite`) VALUES
(1, 'Priorité 1'),
(2, 'Priorité 2'),
(4, 'A modérer'),
(6, 'Clôturé'),
(7, 'Refusé par l\'association'),
(8, 'Urgence'),
(12, 'Refusé par la collectivité'),
(15, 'Doublon');

--
-- Index pour les tables exportées
--

--
-- Index pour la table `priorite`
--
ALTER TABLE `priorite`
 ADD PRIMARY KEY (`id_priorite`);

--
-- AUTO_INCREMENT pour les tables exportées
--

--
-- AUTO_INCREMENT pour la table `priorite`
--
ALTER TABLE `priorite`
MODIFY `id_priorite` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=16;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
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

INSERT INTO `quartier` (`id_quartier`, `lib_quartier`) VALUES (99999, 'Inutile');

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
-- Structure de la table `status`
--

CREATE TABLE `status` (
`id_status` int(11) NOT NULL,
  `lib_status` varchar(100) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

--
-- Contenu de la table `status`
--

INSERT INTO `status` (`id_status`, `lib_status`) VALUES
(1, 'En cours'),
(2, 'Réalisé'),
(3, 'Programmé'),
(4, 'Refusé'),
(5, 'A définir');

--
-- Index pour les tables exportées
--

--
-- Index pour la table `status`
--
ALTER TABLE `status`
 ADD PRIMARY KEY (`id_status`);

--
-- AUTO_INCREMENT pour les tables exportées
--

--
-- AUTO_INCREMENT pour la table `status`
--
ALTER TABLE `status`
MODIFY `id_status` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=6;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
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
-- phpMyAdmin SQL Dump
-- version 3.3.10deb1
-- http://www.phpmyadmin.net
--
-- Serveur: localhost
-- Généré le : Dim 10 Janvier 2016 à 12:03
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
-- Structure de la table `commentaires`
--

CREATE TABLE IF NOT EXISTS `commentaires` (
  `id_commentaires` int(11) NOT NULL,
  `text_commentaires` varchar(1000) DEFAULT NULL,
  `display_commentaires` tinyint(1) DEFAULT NULL,
  `datecreation` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `url_photo` varchar(500) DEFAULT NULL,
  `mail_commentaires` varchar(100) DEFAULT NULL,
  `poi_id_poi` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


ALTER TABLE `commentaires`
ADD CONSTRAINT `commentaires_ibfk_1` FOREIGN KEY (`poi_id_poi`) REFERENCES `poi` (`id_poi`);

