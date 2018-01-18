SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


CREATE TABLE `category` (
`id_category` int(11) NOT NULL AUTO_INCREMENT,
  `lib_category` varchar(100) DEFAULT NULL,
  `icon_category` varchar(100) DEFAULT NULL,
  `treerank_category` int(11) DEFAULT NULL,
  `display_category` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id_category`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;


INSERT INTO `category` (`id_category`, `lib_category`, `icon_category`, `treerank_category`, `display_category`) VALUES
(1, 'Observations', 'iconmarker2', 1, 1);

CREATE TABLE `subcategory` (
`id_subcategory` int(11) NOT NULL AUTO_INCREMENT,
  `lib_subcategory` varchar(100) DEFAULT NULL,
  `icon_subcategory` varchar(100) DEFAULT NULL,
  `treerank_subcategory` int(11) DEFAULT NULL,
  `display_subcategory` tinyint(1) DEFAULT NULL,
  `proppublic_subcategory` tinyint(1) DEFAULT NULL,
  `category_id_category` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_subcategory`), 
  KEY `category_id_category` (`category_id_category`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8;


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


ALTER TABLE `subcategory`
ADD CONSTRAINT `subcategory_ibfk_1` FOREIGN KEY (`category_id_category`) REFERENCES `category` (`id_category`);


CREATE TABLE `territoire` (
  `id_territoire` int(11) NOT NULL AUTO_INCREMENT,
  `lib_territoire` varchar(255) NOT NULL,
  `type_territoire` int(11) NOT NULL,
  `ids_territoire` varchar(4096) NOT NULL,
  PRIMARY KEY (`id_territoire`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;


INSERT INTO `territoire` (`id_territoire`, `lib_territoire`, `type_territoire`, `ids_territoire`) VALUES
(0, 'Zone couverte par VelObs', 0, '');

CREATE TABLE `pole` (
  `id_pole` int(11) NOT NULL AUTO_INCREMENT,
  `lib_pole` varchar(100) DEFAULT NULL,
  `geom_pole` geometry DEFAULT NULL,
  `territoire_id_territoire` int(11) NOT NULL,
  PRIMARY KEY (`id_pole`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;

INSERT INTO `pole` (`id_pole`, `lib_pole`, `geom_pole`, `territoire_id_territoire`) VALUES
(9, 'Hors zone urbaine', NULL, 0),
(12, 'Administrateur ou comcom', NULL, 0);

CREATE TABLE `configmap` (
`id_configmap` int(11) NOT NULL AUTO_INCREMENT,
  `lat_configmap` float DEFAULT NULL,
  `lon_configmap` float DEFAULT NULL,
  `zoom_configmap` int(11) DEFAULT NULL,
  `baselayer_configmap` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_configmap`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `language` (
`id_language` int(11) NOT NULL AUTO_INCREMENT,
  `lib_language` varchar(100) DEFAULT NULL,
  `extension_language` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id_language`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

INSERT INTO `language` (`id_language`, `lib_language`, `extension_language`) VALUES
(1, 'France', 'fr'),
(2, 'English', 'en');

CREATE TABLE `translation` (
`id_translation` int(11) NOT NULL AUTO_INCREMENT,
  `code_translation` varchar(50) DEFAULT NULL,
  `lib_translation` varchar(250) DEFAULT NULL,
  `language_id_language` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_translation`), 
  KEY `language_id_language` (`language_id_language`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8;


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


ALTER TABLE `translation`
ADD CONSTRAINT `translation_ibfk_1` FOREIGN KEY (`language_id_language`) REFERENCES `language` (`id_language`);


CREATE TABLE `commune` (
  `id_commune` int(11) NOT NULL AUTO_INCREMENT,
  `lib_commune` varchar(100) DEFAULT NULL,
  `geom_commune` geometry DEFAULT NULL,
  PRIMARY KEY (`id_commune`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

INSERT INTO `commune` (`id_commune`, `lib_commune`, `geom_commune`) VALUES (99999, 'Autre commune', NULL);

CREATE TABLE `usertype` (
`id_usertype` int(11) NOT NULL AUTO_INCREMENT,
  `lib_usertype` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id_usertype`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

INSERT INTO `usertype` (`id_usertype`, `lib_usertype`) VALUES
(1, 'Administrateur'),
(2, 'Communauté de communes'),
(3, 'Pôle technique'),
(4, 'Responsable pôle modérateur');

CREATE TABLE `users` (
`id_users` int(11) NOT NULL AUTO_INCREMENT,
  `lib_users` varchar(100) DEFAULT NULL,
  `pass_users` varchar(100) DEFAULT NULL,
  `num_pole` int(11) NOT NULL,
  `usertype_id_usertype` int(11) DEFAULT NULL,
  `language_id_language` int(11) DEFAULT NULL,
  `territoire_id_territoire` int(11) DEFAULT NULL,
  `mail_users` varchar(255) NOT NULL,
  `nom_users` varchar(255) NOT NULL,
  PRIMARY KEY (`id_users`), 
  KEY `usertype_id_usertype` (`usertype_id_usertype`), 
  KEY `language_id_language` (`language_id_language`), 
  KEY `territoire_id_territoire` (`territoire_id_territoire`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

INSERT INTO `users` (`id_users`, `lib_users`, `pass_users`, `num_pole`, `usertype_id_usertype`, `language_id_language`, `territoire_id_territoire`, `mail_users`, `nom_users`) VALUES
(1, 'admin', 'admin', 12, 1, 1, 0, 'test@velobs.org', 'Administrateur VelObs');

ALTER TABLE `users`
ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`usertype_id_usertype`) REFERENCES `usertype` (`id_usertype`) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT `users_ibfk_2` FOREIGN KEY (`language_id_language`) REFERENCES `language` (`id_language`) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT `users_ibfk_3` FOREIGN KEY (`territoire_id_territoire`) REFERENCES `territoire` (`id_territoire`);


CREATE TABLE `priorite` (
`id_priorite` int(11) NOT NULL AUTO_INCREMENT,
  `lib_priorite` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id_priorite`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;


INSERT INTO `priorite` (`id_priorite`, `lib_priorite`) VALUES
(1, 'Priorité 1'),
(2, 'Priorité 2'),
(4, 'A modérer'),
(6, 'Clôturé'),
(7, 'Refusé par l\'association'),
(8, 'Urgence'),
(12, 'Refusé par la collectivité'),
(15, 'Doublon');

CREATE TABLE `quartier` (
`id_quartier` int(11) NOT NULL AUTO_INCREMENT,
  `lib_quartier` varchar(100) DEFAULT NULL,
 PRIMARY KEY (`id_quartier`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
INSERT INTO `quartier` (`id_quartier`, `lib_quartier`) VALUES (99999, 'Inutile');

CREATE TABLE `status` (
`id_status` int(11) NOT NULL AUTO_INCREMENT,
  `lib_status` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id_status`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

INSERT INTO `status` (`id_status`, `lib_status`) VALUES
(1, 'En cours'),
(2, 'Réalisé'),
(3, 'Programmé'),
(4, 'Refusé'),
(5, 'A définir');


CREATE TABLE `iconmarker` (
`id_iconmarker` int(11) NOT NULL AUTO_INCREMENT,
  `name_iconmarker` varchar(100) DEFAULT NULL,
  `urlname_iconmarker` varchar(100) DEFAULT NULL,
  `color_iconmarker` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id_iconmarker`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8;



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
(19, 'tourne à droite 2', 'iconmarker19', '');

CREATE TABLE IF NOT EXISTS `poireferences` (
  `year` int(11) NOT NULL,
  `month` int(11) NOT NULL,
  `seq` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
ALTER TABLE `poireferences` ADD UNIQUE(`year`, `month`, `seq`);

CREATE TABLE IF NOT EXISTS `poi` (
  `id_poi` int(11) NOT NULL AUTO_INCREMENT,
  `lib_poi` varchar(100) DEFAULT NULL,
  `ref_poi` varchar(10) DEFAULT NULL,
  `adherent_poi` varchar(100) DEFAULT NULL,
  `adherentfirstname_poi` varchar(100) DEFAULT NULL,
  `rue_poi` varchar(100) DEFAULT NULL,
  `num_poi` varchar(100) DEFAULT NULL,
  `communename_poi` varchar(100) DEFAULT NULL,
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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

ALTER TABLE `poi`
  ADD CONSTRAINT `poi_ibfk_1` FOREIGN KEY (`subcategory_id_subcategory`) REFERENCES `subcategory` (`id_subcategory`),
  ADD CONSTRAINT `poi_ibfk_2` FOREIGN KEY (`commune_id_commune`) REFERENCES `commune` (`id_commune`),
  ADD CONSTRAINT `poi_ibfk_3` FOREIGN KEY (`pole_id_pole`) REFERENCES `pole` (`id_pole`),
  ADD CONSTRAINT `poi_ibfk_4` FOREIGN KEY (`quartier_id_quartier`) REFERENCES `quartier` (`id_quartier`),
  ADD CONSTRAINT `poi_ibfk_5` FOREIGN KEY (`priorite_id_priorite`) REFERENCES `priorite` (`id_priorite`),
  ADD CONSTRAINT `poi_ibfk_6` FOREIGN KEY (`status_id_status`) REFERENCES `status` (`id_status`),
  ADD UNIQUE(`ref_poi`);

CREATE TABLE IF NOT EXISTS `commentaires` (
  `id_commentaires` int(11) NOT NULL AUTO_INCREMENT,
  `text_commentaires` varchar(1000) DEFAULT NULL,
  `display_commentaires` tinyint(1) DEFAULT NULL,
  `datecreation` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `url_photo` varchar(500) DEFAULT NULL,
  `mail_commentaires` varchar(100) DEFAULT NULL,
  `poi_id_poi` int(11) NOT NULL,
    PRIMARY KEY (`id_commentaires`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;


ALTER TABLE `commentaires`
ADD CONSTRAINT `commentaires_ibfk_1` FOREIGN KEY (`poi_id_poi`) REFERENCES `poi` (`id_poi`);

