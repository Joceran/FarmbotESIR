### Aide à la reprise du projet
Le projet a pour but d’ajouter un onglet de Suggestions qui sert de formulaire que l’utilisateur devra remplir. Ce formulaire retournera les recommandations en fonction de ses choix. 

### Comment build le projet
Pour installer les éléments de FarmBot-Web-App, il est conseillé d’utiliser une machine virtuelle et de s’y placer pour toute la durée du projet. Pour installer les éléments dont nous avons besoin sur notre VM (Virtual Machine) suivre l’installation des éléments du FarmBot (voir la partie installation de ce lien : https://github.com/FarmBot/Farmbot-Web-App/blob/master/ubuntu_example.sh)
Une fois cette étape faite, il faut importer le projet au lien suivant : https://github.com/Joceran/FarmbotESIR, puis ouvrir deux consoles, se placer à la racine de notre projet, puis exécuter une commande dans chaque console :

```
rails mqtt:start
rails api:start
```

Après un temps de chargement, il faut ouvrir un navigateur (Firefox par exemple) et aller à l’adresse https://localhost:3000.

### Comment run les tests
A l’heure actuelle, nous n’avons pas de tests.

### Ce qu’il reste à faire :

Etudier la taille restante du champs en fonction de sa taille initial moins la place que prend les plants déjà présents.
Faire une Recherche plus détaillée mais implique une meilleure API.
Discerner les fruits des légumes de façon automatique (problème à cause de l’API qui n’est pas complète).

### Les éléments facilitant l’évolution

L’API proposée sur le GitHub du FarmBot ne permet pas de répondre à toutes les requêtes que nous voulions mettre en évidence lorsque nous avons démarrer le projet (aucune distinction entre les fruits et les légumes).    Idéalement, il nous faudrait une meilleure API avec des paramètres plus nombreux pour expertiser notre recherche et ainsi améliorer la satisfaction du client. Faire une recherche sur cette API qui retournera des noms de variétés de plantes puis rechercher ces noms dans l’API proposé actuellement par le FarmBot serait un bon avancement. 
