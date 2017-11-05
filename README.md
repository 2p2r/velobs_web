VelObs
========

Application web permettant aux cyclistes de signaler les problèmes sur les aménagements cyclables ; puis aux collectivités territoriales compétentes de les traiter (sans obligation de prise en compte, ni de résultat).

VelObs est en  production à 
* Toulouse pour 2 pieds 2 roues sur : http://velobs.2p2r.org/
* Montpellier pour VéloCité : http://www.velocite-montpellier.fr/velobs/

# Quelques commentaires sur l'application :
* VelObs est une application web nécessitant un serveur web avec php et MySQL/MariaDB comme base de données (versions minimum à venir)

* le répertoire lib/js contient tous les scripts nécessaires à l'utilisation :
    * key.js.template configuration des variables spécifiques à votre instance (pour l'instant uniquement l'API KEY de thunderforest
    * translation_fr.js et translation_en.js les deux fichiers de traduction de tous les textes affichés à l'écran (il est possible de modifier les préférences pour chaque utilisateur via base de données et le champ language_id_language de la table users)
    * tous les scripts JavaScript décomposés en trois répertoires :
        * admin : les scripts pour les différents rôles d'usage de l'interface d'administration (1 => admin général 2p2r ; 2 => admin comcom ; 3 => pole technique ; 4 => admin pole 2p2r)
        * public : les scripts pour la carte publique
        * framework : bibliothèques ExtJS 3.4, GeoExt, OpenLayers 2.11 et 4 extensions de classes ExtJS

 * le répertoire lib/php contient tous les scripts serveurs PHP :
    * key.php (configuration générale pour l'accès à la base de données)
    * commonfunction.php pour une fonction commune aux parties publiques et admin
    * tous les scripts sont décomposés en trois répertoires :
        * public :
            * les fichiers get*.php pour les scripts de menu déroulant
            * uploadPhoto.php si une photo éventuelle
        * admin :
            * tous les fichiers get*.php servent principalement à la construction des différents menus déroulants
            * tous les fichiers update*.php servent à la modification des enregistrements par les poles via la carto et pour modifier la construction de l'arbre des couches
            * tous les fichiers upload*.php servent pour le transfert d'images ou d'icones
            * database.php et adminfunction.php sont les deux scripts principaux
            * login.php et disconnect.php pour la gestion des sessions utilisateurs
        * mobile :
            * les scripts pour l'affichage des menus déroulants pour les applications mobile et les scripts pour les nouveaux enregistrements ainsi que pour l'ajout de photos et commentaires éventuels

 * le répertoire resources contient les fichiers plats :
    * répertoire css pour les différentes feuilles de style
    * répertoire csv de stockage d'export des fichiers csv
    * répertoire favicon
    * répertoire html qui contient les pages html des modes d'emploi
    * répertoire icon contient les sets d'icones utilisés + les icônes uploadés pour l'arbre des couches
    * répertoire images les images logo et autres
    * répertoire kml des fichiers de géométries (utile au début)
    * répertoire pictures contient toutes les images relatives aux enregistrements
    * répertoire sql contient toutes les tables de la base de données ) la date du 10 janvier 2016
   
#   Notice d'installation pour l'application VelObs :

 * décompresser l'archive dans le répertoire voulu sur le serveur de production
 * copier le fichier lib/js/key.js.template vers lib/js/key.js
 * éditer lib/js/key.js en ajoutant votre clé d'API thunderforest
 * copier le ficher lib/php/key.php.template vers lib/php/key.php
 * éditer le fichier lib/php/key.php :
    * définir la constante HOST : url du serveur MySQL
    * définir la constante PORT : port du serveur MySQL
    * définir la constante DB_USER : login du serveur MySQL
    * définir la constante DB_PASS : password du serveur MySQL
    * définir la constante DB_NAME : nom de la base de données VelObs
    * définir la constante URL : url de l'application
    * définir les constantes  MAIL_* pour l'envoi des mails de VélObs
    * définir les constantes VELOBS_* en fonction des institutions avec lesquelles vous travaillez
 * modifier les droits en écriture pour les fichiers/répertoires :
    * resources/pictures
    * resources/icon/marker
    * resources/icon/marker/16x18
    * resources/css/icon.css
    * resources/csv
    * Commande : chmod -R 770 resources/pictures resources/icon/marker resources/icon/marker/16x18 resources/css/icon.css resources/csv
 
 * créer une base de données MySQL (ex. velobs) :
    * interclassement : utf8_general_ci
 * importer le script resources/sql/install.sql
 * se connecter à l'interface d'administration de VelObs avec le compte admin (mot de passe : admin) : URL_VelObs/admin.php
     * cliquer sur l'onglet Utilisateurs
     * modifier le mot de passe du compte admin en cliquant dans la cellule correspondante (dès que la cellule perd le focus, le mot de passe se met à jour dans la base de données)
 
#   Notice d'adaptation à d'autres territoires pour l'application VelObs :

  * éditer le fichier lib/php/key.php :  
     * définir les variables propres à l'association vélo et les collectivités concernées
  * éditer les fichiers  lib/js/translate_fr.js et lib/js/translate_en.js pour adapter à votre contexte les variables
     * T_header_main : contenu du panneau supérieur de la page principale
     * T_textHowToParticipate : contenu du pop up "comment participer"
  * adapter les logos dans resources/images en respectant les dimensions    
  * adapter les tables en suivant le protocole dédié (nécessite quelques compétences en Système d'Information Géographique - documentation complète à venir)
     * configmap: coordonnees GPS du centre de la carte
     * territoire: liste des territoires caracterisés par les codes INSEE des communes du territoire  
     * pole:  liste des poles  caractérisés par leur nom et leur contour géographique
     * commune:  liste des communes caractérisées par leur code INSEE et leur contour géographique
  * se connecter à l'interface d'administration de VelObs avec le compte admin : URL_VelObs/admin.php
     * Ajouter les comptes : cliquer sur le menu Utilisateurs > Ajouter un utilisateur
         * modérateurs : sélectionner le rôle Modérateur
