### Principe de mise en œuvre de la solution (comment)

Le système de suggestion fonctionne de la façon suivante : 
Après avoir rempli un formulaire présentant différents paramètres, l’utilisateur se voit afficher différentes suggestions de plante, selon si il a des plantes déjà plantées ou non, ses préférences fruits et/ou légumes et la luminosité nécessaire.

Ces suggestions sont faites en allant chercher les graines dites “compagnons” sur l’API Openfarm.cc afin de faciliter une forme de polyculture (quand faire pousser différentes plantes à proximité leur donne des bénéfices entre elles).

L’utilisateur peut ensuite voir un historique de ses demandes de suggestion. 

### Règles d'architecture
Utilisation de l'existant, en basant notre solution sur le Modèle Vue-Contrôleur déjà présent.

Modèle : Bases de données des suggestions
Vue : Onglet et formulaire
Contrôleur : Système de recommandations


### Explication de la prise en compte des contraintes d'analyse
Etant donnée que nous n'allions pas travailler directement sur le Farmbot, nous avons utilisés surtout regardé le fonctionnement du farmbot via la Web App et comment l'application intéragissait avec ce dernier.

### Cadre de production : outils de dev, de configuration et de livraison.
Le contrôle de version utilisé est Git, où nous y déposions nos modifications.

Les technologies utilisés sont les mêmes que le Farmbot-Web-App d’origine, c’est à dire Ruby, Ruby On Rails et Typescript principalement.

Pour la communication intra-projet nous avons utilisés Slack.


