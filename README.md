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
   
Pour installer VelObs sur votre territoire, veuillez consulter le document INSTALL.odt
