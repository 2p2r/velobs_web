#!/bin/bash
#Script de mise à jour de velobs.
#besoin d'un répertoire contenant les sources à passer en production
#copie les fichiers d'intérêts pour la production (key.php et key.js + répertoire resources/pictures) dans le répertoire des sources à paser en production
#renomme le dossier de production en le suffixant avec un timestamp
#renomme le dossier des sources à passer en production avec le nom du répertoire de production

defaultVersion=V1_3

echo "$(tput setaf 1)Ce script doit se trouver au même niveau que les répertoires source de velobs, de production comme la version à mettre en production. Si ce n'est pas le cas, veuillez quitter et déplacer ce script et le répertoire contenant la nouvelle version de velobs au même niveau que le répertoire de velobs en production SVP.$(tput sgr 0)"
echo ""
echo -n "$(tput setaf 2)Nom du répertoire contenant les sources de velobs à passer en production? $(tput sgr 0)"
read velobsDev
echo -n "$(tput setaf 2)Nom du répertoire contenant les sources de velobs actuellement en production? $(tput sgr 0)"
read velobsProd
echo -n "$(tput setaf 2)Version de VelObs qui sera passée en production (important car permet d'exécuter un script correspondant, s'il existe) - défaut $defaultVersion? $(tput sgr 0)"
read velobsVersion

if [  -z $velobsVersion ]
then
        echo "$(tput setaf 1)La version n'a pas été spécifiée, on utilise la valeur par défaut $defalutVersion$(tput sgr 0)"
        velobsVersion=$defaultVersion
fi

timestamp=$(date +%s)
if [  -z $velobsDev ]
then
        echo "$(tput setaf 1)Le répertoire des sources à mettre en production n'a pas été spécifié, on sort$(tput sgr 0)"
        exit
fi

if [ ! -d $velobsDev ]
then
        echo "$(tput setaf 1)"$velobsDev " n'existe pas, on sort$(tput sgr 0)"
        exit
fi
phpKeyVelobsDev=$velobsDev"/lib/php/key.php"
jsKeyVelobsDev=$velobsDev"/lib/js/key.js"

if [ -e $phpKeyVelobsDev ]
then
        echo "$(tput setaf 1)Le fichier "$phpKeyVelobsDev" existe dans les sources de la nouvelle version de velobs. Etes-vous sûr(e) de ne pas avoir inversé les noms des répertoires? Dans le doute, on ne fait rien et on annule la mise à jour. Veuillez supprimer le fichier "$phpKeyVelobsDev" avant de recommencer la mise à jour SVP.$(tput sgr 0)"
        exit
fi
if [ -e $jsKeyVelobsDev ]
then
        echo "$(tput setaf 1)Le fichier "$jsKeyVelobsDev" existe dans les sources de la nouvelle version de velobs. Etes-vous sûr(e) de ne pas avoir inversé les noms des répertoires? Dans le doute, on ne fait rien et on annule la mise à jour. Veuillez supprimer le fichier "$jsKeyVelobsDev" avant de recommencer la mise à jour SVP.$(tput sgr 0)"
        exit
fi
if [ ! -d $velobsProd ]
then
        echo "$(tput setaf 1)"$velobsProd " n'existe pas, on sort$(tput sgr 0)"
        exit
fi

echo "$(tput setaf 4)Toutes les conditions semblent réunies pour passer la nouvelle version de velobs en production$(tput sgr 0)"

echo "Copie des photos de "$velobsProd"/resources/pictures/ dans "$velobsDev"/resources"
cp -r $velobsProd/resources/pictures/ $velobsDev/resources/

echo "Copie de "$velobsProd"/lib/php/key.php dans "$velobsDev"/lib/php/"
cp $velobsProd/lib/php/key.php $velobsDev/lib/php/

echo "Copie de "$velobsProd"/lib/js/key.js dans "$velobsDev"/lib/js/"
cp $velobsProd/lib/js/key.js $velobsDev/lib/js/

echo -n "$(tput setaf 2)Merci de modifier "$velobsDev"/lib/js/key.js et "$velobsDev"/lib/php/key.php si nécessaire pour être raccord avec le contenu de "$velobsDev"/lib/js/key.js.template et "$velobsDev"/lib/php/key.php.template (dans le cas où des clés auraient été ajoutées ou modifiées). Appuyez sur une touche quand vous avez fait les éventuelles modifications$(tput sgr 0)"
read

echo "Application des droits d'écriture sur le répertoire de sortie où sont générés les fichiers csv d'export de velobs : chmod 775 "$velobsDev"/resources/csv "$velobsDev"/resources/pictures"
chmod 775 $velobsDev/resources/csv $velobsDev/resources/pictures $velobsDev/resources/icon/marker

echo "switch des version de velobs pour le passage en production : mv $velobsProd $velobsProd$timestamp; mv $velobsDev $velobsProd"
mv $velobsProd $velobsProd.$timestamp;mv $velobsDev $velobsProd


PHP=`which php`
if [ -e $velobsProd/resources/upgrade/upgradeSQL-$velobsVersion.php ]
then
        cd $velobsProd/resources/upgrade
        echo "Exécution de la commande $PHP $velobsProd/resources/upgrade/upgradeSQL-$velobsVersion.php"
        $PHP upgradeSQL-$velobsVersion.php > ../../../sortie_upgradeSQL-$velobsVersion.log
        echo ""
        echo "$(tput setaf 1)Le script php a été exécuté. Vérifiez les logs sortie_upgradeSQL-$velobsVersion.log pour vérifier qu'il n'y a pas d'erreur. On affiche la fin de ce fichier de log ci-dessous : $(tput sgr 0)"
        tail ../../../sortie_upgradeSQL-$velobsVersion.log
else
        echo "$(tput setaf 1)Le fichier $velobsProd/resources/upgrade/upgradeSQL-$velobsVersion.php n'existe pas. Il se peut qu'aucun script SQL n'existe pour ce changement de version, mais vérifiez que vous avez spécifié fidèlement la version de velobs à laquelle vous passez (de la forme Vx_y). Si vous vous êtes trompé(e), vous devrez exécuter le script en ligne de commande.$(tput sgr 0)"
fi

echo "$(tput setaf 5)La nouvelle version de velobs est installée. Merci de la tester SVP.$(tput sgr 0)"
