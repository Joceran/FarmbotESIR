# Objectifs

L’objectif de ce projet est d’ajouter une interface de Suggestion à
l’utilisateur qui possède un FarmBot. En y remplissant un
questionnaire sur ses goûts, ses envies, la saison actuelle, etc, notre
fonctionnalité proposera une ou plusieurs variétés de légumes à faire
planter. 

### Modèle du domaine métier : modèle UML des notions manipulées, relations et explications

Table d’une suggestion :

| Id (généré automatiquement) | Id de la Liste de suggestion | Id de la plante proposée | "Pseudo” de la plante | La quantité pouvant être plantée | Plante proposée parce qu’il y a cette plante de plantée |
| --------------------------- | ---------------------------- | ------------------------ | --------------------- | -------------------------------- | ------------------------------------------------------- |

Table de la liste des suggestions


| Id  | Id de l'utilisateur | Date de la demande | Luminosité |
| --- | ------------------- | ------------------ | ---------- |

### Description de l'écosystème : présentation des éléments avec lesquels le système va devoir s'intégrer, des contraintes à respecter

Les principales contraintes à respecter étaient la prise en main du
langage Ruby on Rails que nous ne connaissions pas. L’application du
FarmBot étant composée de ce langage, il nous fallait le découvrir puis
ajouter notre fonctionnalité à tout un projet déjà existant et
relativement complexe que nous ne connaissions pas au début de ce
projet.

Il fallait également gérer l’API du FarmBot (OpenFarm), qui malgré son
utilité, reste assez limitée dans ce qu’elle propose. Par exemple, elle
ne distingue pas un fruit d’un légume et ne prend pas le nombre de
graines disponibles pour savoir si on peut planter ce type de plantes
immédiatement ou non.

### Principe de solution : description externe de la solution proposée ( le quoi, pas le comment)

Après avoir créer un onglet de Suggestions, puis créer un formulaire
en React.js à l’intérieur de cet onglet, nous avons cherché à mettre en
relation les réponses de l’utilisateur avec les fruits et légumes de
l’API du FarmBot afin de lui proposer la meilleure recommandation
possible. 

### Les grandes fonctionnalités présentes :

  - Sur l’application, il y a donc un nouvel onglet “Suggestions” qui
    aura pour effet de proposer une variété de légumes.
  - Liaison entre l’API du FarmBot (OpenFarm) et les réponses au
    questionnaire du client
  - Récupération des Suggestions.
  - Récupération de l’historique des suggestions de l’utilisateurs

### Celles qui reste à faire :

  - Etudier la taille restante du champs en fonction de sa taille
    initial moins la place que prend les plants déjà présents.
  - Discerner les fruits des légumes (problème à cause de l’API qui
    n’est pas complète)
