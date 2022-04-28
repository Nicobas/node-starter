# node-starter

Ce projet est un starter Node.js en JavaScript pour développer des services web

Il contient des exemples de microservices qui peuvent être adaptés au besoin

## Services
- **api** : API REST gérée par Express avec validation de données Joi. Elle contient un register, un login et un crud

## Technologies

### Code

- **Node.js** pour l'exécution des services
- **Mongoose** pour la gestion de la bdd
- **Express.js** pour construire les APIs
- **Joi** pour la validation des données
- **Bcrypt** pour la gestion des mots de passe
- **JWT** pour l'authentification
- **Winston** pour logger l'application (couplé a morgan pour Express)
- **Yarn** pour la gestion des modules
- **ESLint** pour la qualité du code
- **Docker** et **Docker Compose** pour conteneuriser l'ensemble

### Données

- **MongoDB** pour la base de donnée du projet
- **Redis** pour la mémoire partagée entre les services

## Comment lancer le projet ?

Les services sont lancés dans des conteneurs avec Docker et Docker compose

1. Cloner le projet
2. Configurer les variables d'environnement (voir section "Configuration" ci-dessous)
3. Lancer l'ensemble des services :

`yarn run project` ou

`yarn run project:debug` (hot reload via nodemon)

## Configuration

[Voir la documentation relative à la gestion de la configuration des environnements](./config)

## Lint

- Pour vérifier le code avec ESLint : `yarn run lint`
- Pour corriger le code avec ESLint : `yarn run lint:fix`
