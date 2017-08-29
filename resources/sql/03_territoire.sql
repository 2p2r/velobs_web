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
