SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Structure DDL
--
CREATE TABLE `category` (
`id_category` int(11) NOT NULL AUTO_INCREMENT,
  `lib_category` varchar(100) DEFAULT NULL,
  `icon_category` varchar(100) DEFAULT NULL,
  `treerank_category` int(11) DEFAULT NULL,
  `display_category` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id_category`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE = utf8mb4_unicode_ci AUTO_INCREMENT=1;


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
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE = utf8mb4_unicode_ci AUTO_INCREMENT=1;



ALTER TABLE `subcategory`
ADD CONSTRAINT `subcategory_ibfk_1` FOREIGN KEY (`category_id_category`) REFERENCES `category` (`id_category`);


CREATE TABLE `territoire` (
  `id_territoire` int(11) NOT NULL AUTO_INCREMENT,
  `lib_territoire` varchar(255) NOT NULL,
  `type_territoire` int(11) NOT NULL,
  `ids_territoire` varchar(4096) NOT NULL,
  PRIMARY KEY (`id_territoire`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE = utf8mb4_unicode_ci AUTO_INCREMENT=1;



CREATE TABLE `pole` (
  `id_pole` int(11) NOT NULL AUTO_INCREMENT,
  `lib_pole` varchar(100) DEFAULT NULL,
  `geom_pole` geometry DEFAULT NULL,
  `territoire_id_territoire` int(11) NOT NULL,
  PRIMARY KEY (`id_pole`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE = utf8mb4_unicode_ci AUTO_INCREMENT=1;



CREATE TABLE `configmap` (
`id_configmap` int(11) NOT NULL AUTO_INCREMENT,
  `lat_configmap` float DEFAULT NULL,
  `lon_configmap` float DEFAULT NULL,
  `zoom_configmap` int(11) DEFAULT NULL,
  `baselayer_configmap` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_configmap`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE = utf8mb4_unicode_ci AUTO_INCREMENT=1;

CREATE TABLE `language` (
`id_language` int(11) NOT NULL AUTO_INCREMENT,
  `lib_language` varchar(100) DEFAULT NULL,
  `extension_language` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id_language`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE = utf8mb4_unicode_ci AUTO_INCREMENT=1;



CREATE TABLE `translation` (
`id_translation` int(11) NOT NULL AUTO_INCREMENT,
  `code_translation` varchar(50) DEFAULT NULL,
  `lib_translation` varchar(250) DEFAULT NULL,
  `language_id_language` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_translation`), 
  KEY `language_id_language` (`language_id_language`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE = utf8mb4_unicode_ci AUTO_INCREMENT=1;


ALTER TABLE `translation`
ADD CONSTRAINT `translation_ibfk_1` FOREIGN KEY (`language_id_language`) REFERENCES `language` (`id_language`);


CREATE TABLE `commune` (
  `id_commune` int(11) NOT NULL AUTO_INCREMENT,
  `lib_commune` varchar(100) DEFAULT NULL,
  `geom_commune` geometry DEFAULT NULL,
  PRIMARY KEY (`id_commune`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE = utf8mb4_unicode_ci AUTO_INCREMENT=1;



CREATE TABLE `usertype` (
`id_usertype` int(11) NOT NULL AUTO_INCREMENT,
  `lib_usertype` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id_usertype`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE = utf8mb4_unicode_ci AUTO_INCREMENT=1;


CREATE TABLE IF NOT EXISTS `users` (
  `id_users` int(11) NOT NULL,
  `lib_users` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pass_users` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `usertype_id_usertype` int(11) DEFAULT NULL,
  `language_id_language` int(11) DEFAULT NULL,
  `mail_users` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nom_users` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active_user` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Index pour les tables exportées
--

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id_users`),
  ADD KEY `usertype_id_usertype` (`usertype_id_usertype`),
  ADD KEY `language_id_language` (`language_id_language`);

--
-- AUTO_INCREMENT pour les tables exportées
--

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id_users` int(11) NOT NULL AUTO_INCREMENT;
--
-- Contraintes pour les tables exportées
--

--
-- Contraintes pour la table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`usertype_id_usertype`) REFERENCES `usertype` (`id_usertype`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_2` FOREIGN KEY (`language_id_language`) REFERENCES `language` (`id_language`) ON DELETE CASCADE ON UPDATE CASCADE;


CREATE TABLE IF NOT EXISTS `users_link_pole` (
  `user_link_pole_id` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `territoire_id_territoire` int(11) NOT NULL,
  `num_pole` int(11) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='link between users and territoires/poles';

--
-- Index pour les tables exportées
--

--
-- Index pour la table `users_link_pole`
--
ALTER TABLE `users_link_pole`
  ADD PRIMARY KEY (`user_link_pole_id`),
  ADD KEY `id_user` (`id_user`),
  ADD KEY `territoire_id_territoire` (`territoire_id_territoire`),
  ADD KEY `num_pole` (`num_pole`);

--
-- AUTO_INCREMENT pour les tables exportées
--

--
-- AUTO_INCREMENT pour la table `users_link_pole`
--
ALTER TABLE `users_link_pole`
  MODIFY `user_link_pole_id` int(11) NOT NULL AUTO_INCREMENT;
--
-- Contraintes pour les tables exportées
--

--
-- Contraintes pour la table `users_link_pole`
--
ALTER TABLE `users_link_pole`
  ADD CONSTRAINT `poles_FK` FOREIGN KEY (`num_pole`) REFERENCES `pole` (`id_pole`),
  ADD CONSTRAINT `territoires_FK` FOREIGN KEY (`territoire_id_territoire`) REFERENCES `territoire` (`id_territoire`),
  ADD CONSTRAINT `users_FK` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_users`);

CREATE TABLE IF NOT EXISTS `priorite` (
  `id_priorite` int(11) NOT NULL,
  `lib_priorite` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `non_visible_par_collectivite` tinyint(1) NOT NULL DEFAULT '0',
  `non_visible_par_public` tinyint(1) NOT NULL DEFAULT '0',
  `priorite_sujet_email` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `priorite_corps_email` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `besoin_commentaire_association` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Index pour la table `priorite`
--
ALTER TABLE `priorite`
  ADD PRIMARY KEY (`id_priorite`);


--
-- AUTO_INCREMENT pour la table `priorite`
--
ALTER TABLE `priorite`
  MODIFY `id_priorite` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=16;

CREATE TABLE `quartier` (
`id_quartier` int(11) NOT NULL AUTO_INCREMENT,
  `lib_quartier` varchar(100) DEFAULT NULL,
 PRIMARY KEY (`id_quartier`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE = utf8mb4_unicode_ci AUTO_INCREMENT=1;
INSERT INTO `quartier` (`id_quartier`, `lib_quartier`) VALUES (99999, 'Inutile');

CREATE TABLE IF NOT EXISTS `status` (
  `id_status` int(11) NOT NULL,
  `lib_status` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `color_status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active_status` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_status`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE = utf8mb4_unicode_ci AUTO_INCREMENT=1;

CREATE TABLE `iconmarker` (
`id_iconmarker` int(11) NOT NULL AUTO_INCREMENT,
  `name_iconmarker` varchar(100) DEFAULT NULL,
  `urlname_iconmarker` varchar(100) DEFAULT NULL,
  `color_iconmarker` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id_iconmarker`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE = utf8mb4_unicode_ci AUTO_INCREMENT=1;


--
-- Structure de la table `poi_history`
--

CREATE TABLE IF NOT EXISTS `poi_history` (
  `id_poi` int(11) NOT NULL,
  `lib_poi` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `adherent_poi` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rue_poi` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `num_poi` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mail_poi` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tel_poi` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `geom_poi` geometry DEFAULT NULL,
  `desc_poi` mediumtext COLLATE utf8mb4_unicode_ci,
  `prop_poi` mediumtext COLLATE utf8mb4_unicode_ci,
  `display_poi` tinyint(1) DEFAULT NULL,
  `fix_poi` tinyint(1) DEFAULT NULL,
  `moderation_poi` tinyint(1) DEFAULT NULL,
  `datecreation_poi` date DEFAULT NULL,
  `datefix_poi` date DEFAULT NULL,
  `photo_poi` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `geolocatemode_poi` int(11) DEFAULT NULL,
  `subcategory_id_subcategory` int(11) DEFAULT NULL,
  `commune_id_commune` int(11) DEFAULT NULL,
  `pole_id_pole` int(11) DEFAULT NULL,
  `quartier_id_quartier` int(11) DEFAULT NULL,
  `priorite_id_priorite` int(11) DEFAULT NULL,
  `observationterrain_poi` mediumtext COLLATE utf8mb4_unicode_ci,
  `reponse_collectivite_poi` mediumtext COLLATE utf8mb4_unicode_ci,
  `commentfinal_poi` mediumtext COLLATE utf8mb4_unicode_ci,
  `status_id_status` int(11) DEFAULT NULL,
  `transmission_poi` tinyint(1) DEFAULT NULL,
  `traiteparpole_poi` tinyint(1) DEFAULT NULL,
  `reponsepole_poi` mediumtext COLLATE utf8mb4_unicode_ci,
  `mailsentuser_poi` tinyint(1) DEFAULT '0',
  `delete_poi` tinyint(1) DEFAULT '0',
  `lastdatemodif_poi` date DEFAULT NULL,
  `lastmodif_user_poi` int(11) DEFAULT NULL,
  `history_id` int(11) NOT NULL,
  `history_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Index pour les tables exportées
--

--
-- Index pour la table `poi_history`
--
ALTER TABLE `poi_history`
  ADD PRIMARY KEY (`history_id`);

--
-- AUTO_INCREMENT pour les tables exportées
--

--
-- AUTO_INCREMENT pour la table `poi_history`
--
ALTER TABLE `poi_history`
  MODIFY `history_id` int(11) NOT NULL AUTO_INCREMENT;

CREATE TABLE IF NOT EXISTS `poi` (
  `id_poi` int(11) NOT NULL,
  `lib_poi` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `adherent_poi` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rue_poi` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `num_poi` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mail_poi` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tel_poi` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `geom_poi` geometry DEFAULT NULL,
  `desc_poi` mediumtext COLLATE utf8mb4_unicode_ci,
  `prop_poi` mediumtext COLLATE utf8mb4_unicode_ci,
  `display_poi` tinyint(1) DEFAULT NULL,
  `fix_poi` tinyint(1) DEFAULT NULL,
  `moderation_poi` tinyint(1) DEFAULT NULL,
  `datecreation_poi` date DEFAULT NULL,
  `datefix_poi` date DEFAULT NULL,
  `photo_poi` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `geolocatemode_poi` int(11) DEFAULT NULL,
  `subcategory_id_subcategory` int(11) DEFAULT NULL,
  `commune_id_commune` int(11) DEFAULT NULL,
  `pole_id_pole` int(11) DEFAULT NULL,
  `quartier_id_quartier` int(11) DEFAULT NULL,
  `priorite_id_priorite` int(11) DEFAULT NULL,
  `observationterrain_poi` mediumtext COLLATE utf8mb4_unicode_ci,
  `reponse_collectivite_poi` mediumtext COLLATE utf8mb4_unicode_ci,
  `commentfinal_poi` mediumtext COLLATE utf8mb4_unicode_ci,
  `status_id_status` int(11) DEFAULT NULL,
  `transmission_poi` tinyint(1) DEFAULT NULL,
  `traiteparpole_poi` tinyint(1) DEFAULT NULL,
  `reponsepole_poi` mediumtext COLLATE utf8mb4_unicode_ci,
  `mailsentuser_poi` tinyint(1) DEFAULT '0',
  `delete_poi` tinyint(1) DEFAULT '0',
  `lastdatemodif_poi` date DEFAULT NULL,
  `lastmodif_user_poi` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déclencheurs `poi`
--
DELIMITER $$
CREATE TRIGGER `generate_poi_history` BEFORE UPDATE ON `poi`
 FOR EACH ROW INSERT INTO poi_history SELECT p.*,NULL,NOW() FROM poi p WHERE p.id_poi = OLD.id_poi
$$
DELIMITER ;

--
-- Index pour les tables exportées
--

--
-- Index pour la table `poi`
--
ALTER TABLE `poi`
  ADD PRIMARY KEY (`id_poi`),
  ADD KEY `subcategory_id_subcategory` (`subcategory_id_subcategory`),
  ADD KEY `commune_id_commune` (`commune_id_commune`),
  ADD KEY `pole_id_pole` (`pole_id_pole`),
  ADD KEY `quartier_id_quartier` (`quartier_id_quartier`),
  ADD KEY `priorite_id_priorite` (`priorite_id_priorite`),
  ADD KEY `status_id_status` (`status_id_status`),
  ADD KEY `lastmodif_user_poi` (`lastmodif_user_poi`);

--
-- AUTO_INCREMENT pour les tables exportées
--

--
-- AUTO_INCREMENT pour la table `poi`
--
ALTER TABLE `poi`
  MODIFY `id_poi` int(11) NOT NULL AUTO_INCREMENT;
--
-- Contraintes pour les tables exportées
--

--
-- Contraintes pour la table `poi`
--
ALTER TABLE `poi`
  ADD CONSTRAINT `poi_ibfk_7` FOREIGN KEY (`lastmodif_user_poi`) REFERENCES `users` (`id_users`),
  ADD CONSTRAINT `poi_ibfk_1` FOREIGN KEY (`subcategory_id_subcategory`) REFERENCES `subcategory` (`id_subcategory`),
  ADD CONSTRAINT `poi_ibfk_2` FOREIGN KEY (`commune_id_commune`) REFERENCES `commune` (`id_commune`),
  ADD CONSTRAINT `poi_ibfk_3` FOREIGN KEY (`pole_id_pole`) REFERENCES `pole` (`id_pole`),
  ADD CONSTRAINT `poi_ibfk_4` FOREIGN KEY (`quartier_id_quartier`) REFERENCES `quartier` (`id_quartier`),
  ADD CONSTRAINT `poi_ibfk_5` FOREIGN KEY (`priorite_id_priorite`) REFERENCES `priorite` (`id_priorite`),
  ADD CONSTRAINT `poi_ibfk_6` FOREIGN KEY (`status_id_status`) REFERENCES `status` (`id_status`);

  
  --
-- Structure de la table `comment_history`
--

CREATE TABLE IF NOT EXISTS `comment_history` (
  `id_commentaires` int(11) NOT NULL,
  `text_commentaires` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `display_commentaires` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Non modéré',
  `datecreation` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `url_photo` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mail_commentaires` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `poi_id_poi` int(11) NOT NULL,
  `comment_poi_follow` tinyint(1) NOT NULL DEFAULT '0',
  `lastdatemodif_comment` date DEFAULT NULL,
  `lastmodif_user_comment` int(11) DEFAULT NULL,
  `history_id` int(11) NOT NULL,
  `history_date` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Index pour les tables exportées
--

--
-- Index pour la table `comment_history`
--
ALTER TABLE `comment_history`
  ADD PRIMARY KEY (`history_id`);

--
-- AUTO_INCREMENT pour les tables exportées
--

--
-- AUTO_INCREMENT pour la table `comment_history`
--
ALTER TABLE `comment_history`
  MODIFY `history_id` int(11) NOT NULL AUTO_INCREMENT;
  
  
--
-- Structure de la table `commentaires`
--

CREATE TABLE IF NOT EXISTS `commentaires` (
  `id_commentaires` int(11) NOT NULL,
  `text_commentaires` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `display_commentaires` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Non modéré',
  `datecreation` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `url_photo` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mail_commentaires` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `poi_id_poi` int(11) NOT NULL,
  `comment_poi_follow` tinyint(1) NOT NULL DEFAULT '0',
  `lastdatemodif_comment` date DEFAULT NULL,
  `lastmodif_user_comment` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déclencheurs `commentaires`
--
DELIMITER $$
CREATE TRIGGER `generate_comment_history` BEFORE UPDATE ON `commentaires`
 FOR EACH ROW INSERT INTO comment_history SELECT c.*,NULL,NOW() FROM commentaires c WHERE c.id_commentaires = OLD.id_commentaires
$$
DELIMITER ;

--
-- Index pour les tables exportées
--

--
-- Index pour la table `commentaires`
--
ALTER TABLE `commentaires`
  ADD PRIMARY KEY (`id_commentaires`);

--
-- AUTO_INCREMENT pour les tables exportées
--

--
-- AUTO_INCREMENT pour la table `commentaires`
--
ALTER TABLE `commentaires`
  MODIFY `id_commentaires` int(11) NOT NULL AUTO_INCREMENT;


CREATE TABLE IF NOT EXISTS `support_poi` (
  `support_poi_id` int(11) NOT NULL,
  `poi_poi_id` int(11) NOT NULL,
  `support_poi_mail` varchar(100) NOT NULL,
  `support_poi_follow` tinyint(1) NOT NULL,
  `support_poi_creationdate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Index pour les tables exportées
--

--
-- Index pour la table `support_poi`
--
ALTER TABLE `support_poi`
  ADD PRIMARY KEY (`support_poi_id`),
  ADD UNIQUE KEY `poi_poi_id_2` (`poi_poi_id`,`support_poi_mail`),
  ADD KEY `support_poi_mail` (`support_poi_mail`),
  ADD KEY `poi_poi_id` (`poi_poi_id`);

--
-- AUTO_INCREMENT pour les tables exportées
--

--
-- AUTO_INCREMENT pour la table `support_poi`
--
ALTER TABLE `support_poi`
  MODIFY `support_poi_id` int(11) NOT NULL AUTO_INCREMENT;
--
-- Contraintes pour les tables exportées
--

--
-- Contraintes pour la table `support_poi`
--
ALTER TABLE `support_poi`
  ADD CONSTRAINT `support_poi_FK` FOREIGN KEY (`poi_poi_id`) REFERENCES `poi` (`id_poi`);
--
-- Data DDL
--

INSERT INTO `category` (`id_category`, `lib_category`, `icon_category`, `treerank_category`, `display_category`) VALUES
(1, 'Observations', 'iconmarker2', 1, 1);


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


INSERT INTO `territoire` (`id_territoire`, `lib_territoire`, `type_territoire`, `ids_territoire`) VALUES
(0, 'Zone couverte par VelObs', 0, '');

INSERT INTO `pole` (`id_pole`, `lib_pole`, `geom_pole`, `territoire_id_territoire`) VALUES
(9, 'Hors zone urbaine', NULL, 0),
(12, 'Administrateur ou comcom', NULL, 0);
INSERT INTO `language` (`id_language`, `lib_language`, `extension_language`) VALUES
(1, 'France', 'fr'),
(2, 'English', 'en');


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
(23, 'PICTURESIZE', 'La photo semble trop lourde.', 1),
(24, 'PICTURESIZE', 'The picture seems too heavy.', 2),
(25, 'PHOTOTRANSFERTDONE', 'Le transfert de la photo a réussi.', 1),
(26, 'PHOTOTRANSFERTDONE', 'The transfer of the photo was successful.', 2),
(27, 'MADEBYMOOVEATIS', 'Mooveatis', 1),
(28, 'MADEBYMOOVEATIS', 'Mooveatis', 2);

INSERT INTO `commune` (`id_commune`, `lib_commune`, `geom_commune`) VALUES (99999, 'Autre commune', NULL);

INSERT INTO `usertype` (`id_usertype`, `lib_usertype`) VALUES
(1, 'Administrateur'),
(2, 'Communauté de communes'),
(3, 'Pôle technique'),
(4, 'Responsable pôle modérateur');

INSERT INTO `users` (`id_users`, `lib_users`, `pass_users`, `usertype_id_usertype`, `language_id_language`, `mail_users`, `nom_users`) VALUES
(1, 'admin', '$2y$10$LF2rVDO53KwRIzrb8BqoK.dVKa3kY2crgwWVl/NpRFUNtflClGJrG', 1, 1, 'test@velobs.org', 'Administrateur VelObs');
INSERT INTO `users_link_pole` (`id_user`, `territoire_id_territoire`, `num_pole`) VALUES
(1, 0, 12);

--
-- Contenu de la table `priorite`
--

INSERT INTO `priorite` (`id_priorite`, `lib_priorite`, `non_visible_par_collectivite`, `non_visible_par_public`, `priorite_sujet_email`, `priorite_corps_email`, `besoin_commentaire_association`) VALUES
(1, 'Priorité 1', 0, 0, 'Merci pour votre participation', 'Bonjour !\nL''observation que \nvous avez envoyée sur VelObs a changé de statut. \n\nLe problème identifié a été transmis aux services municipaux.', 0),
(2, 'Priorité 2', 0, 0, 'Merci pour votre participation', 'Bonjour !\nL''observation que vous avez envoyée sur VelObs a changé de statut. Le problème identifié a été transmis aux services municipaux.\\n', 0),
(4, 'A modérer', 0, 1, '', '', 0),
(6, 'Clôturé', 1, 0, 'Observation prise en compte', 'Bonjour !\nL''Association #VELOBS_ASSOCIATION# vous remercie. Le problème a bien été pris en compte et réglé par la collectivité.', 1),
(7, 'Refusé par l\'association', 1, 1, 'Observation non transmise à la collectivité', 'Bonjour !\r\nL''Association #VELOBS_ASSOCIATION# et la collectivité vous remercient de votre participation.\r\nCependant le problème rapporté a été refusé par l''association et n''a pas été transmis à la collectivité.', 1),
(8, 'Urgence', 1, 0, 'Merci pour votre participation', 'Bonjour ! \nL''observation que vous avez envoyée a été modérée par l''association. Le problème identifié est une urgence qui nécessite une intervention rapide des services techniques de la collectivité. Merci de faire le nécessaire.\nVeuillez téléphoner au 05 61 222 222 pour prévenir de ce problème si celui-ci est sur la commune de Toulouse.', 1),
(12, 'Refusé par collectivité', 0, 0, 'Observation refusée par la collectivité', 'Bonjour ! \nL''Association #VELOBS_ASSOCIATION# et la collectivité vous remercient de votre participation. Cependant le problème rapporté a été refusé par la collectivité.', 1),
(15, 'Doublon', 1, 1, 'Observation en doublon', 'Bonjour ! \nL''Association #VELOBS_ASSOCIATION# et la collectivité vous remercient de votre participation. Le problème que vous avez identifié nous a déjà été rapporté par un autre observateur.', 1);


INSERT INTO `status` (`id_status`, `lib_status`, `color_status`) VALUES
(1, 'En cours', 'black'),
(2, 'Réalisé', 'green'),
(3, 'Programmé', 'blue'),
(4, 'Refusé', 'red'),
(5, 'A définir', 'black');

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
