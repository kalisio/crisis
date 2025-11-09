# Plan de test

Les tests doivent être réalisés sur **Chrome, Firefox, Edge et Safari (Apple)**, et exécutés sur **desktop, tablette et mobile**, en veillant à installer l’application sur ces derniers.

⚠️ Les tests marqués de l’annotation  _(Test automatisé)_ ne sont automatisés que pour **Chrome sur desktop**. Ces tests automatisés servent uniquement à vérifier rapidement l’application déployée sur l’environnement staging avant le déploiement sur l’environnement de test.

👉 Sur l’environnement de test, il est nécessaire d’exécuter l’ensemble des combinaisons de tests (navigateurs × supports).

## Tests

### **1. Lancement de l'application** _(Test automatisé)_

| Action | Résultat attendu |
|---|---|
| 1. Ouvrir l'application | xxxxxxxxxxxxxxxxx |
| 2. Ouvrir le panneau gauche | xxxxxxxxxxxxxxxxx |

### Tests supplémentaires à prévoir :

1. xxxxxxxxxxxxxxxxx

## Rapport de tests

A chaque exécution des tests un rapport contenant les informations suivantes devrait être produit.

| Informations ||
|---|---|
| Date d'exécution | _date_ |
| Version | _version de l'application_ |
| Build | _build number de l'application_ |
 
### Information système

_information système de la about box_

### Résultats

Nombre total de tests: ...

| Etat | Nombre | Pourcentage |
|---|---|---|
| Passés | ...  | ...% |  
| Echoués | ... | ...% |
| Non réalisés | ... | ...% |

### Echecs

| ID du test | Description |
|---|---|
| _id_  | _explications sur les étapes en échec_ |

### Remarques

* _remarque 1_
* _remarque 2_