# Configuration

## Fonctionnement

Chaque environnement utilise 3 fichiers de configuration :
- `config.js` : il contient la configuration commune à tous les environnements
- `config.<env>.js` : il contient la configuration spécifique à l'environnement, il ne doit pas contenir de données sensibles car il est présent sur le git
- `config.<env>.secret.js` : il contient la configuration secrète de l'environnement (tokens, secrets, passwords, ...), il est ignoré par git mais sa version chiffrée (`config.<env>.secret.js.enc`) doit être générée et présente sur le git

La configuration finale des services est le résultat d'un deep merge sur la configuration de ces trois fichiers et dans cet ordre.

Les services ont besoin de deux variables d'environnement pour lire la configuration :
- `CONFIG_NAME` : il définit quels fichiers sont utilisés (`config.<CONFIG_NAME>.js` et `config.<CONFIG_NAME>.js.secret.enc`)
- `CONFIG_PASSWORD` : la clé de chiffrement du fichier de configuration secrète

La configuration finale est disponible dans les services via une variable globale `CONFIG`

## Comment passer les variables d'environnement ?

### Dans un fichier .env

Créer un fichier `.env` à la racine du projet et ajouter les variables (voir fichier `.env.example`)

### Dans la commande pour lancer les services (override .env)

`CONFIG_NAME=... CONFIG_PASSWORD=... <commande>`

Exemple : `CONFIG_NAME=local CONFIG_PASSWORD=aze123 yarn run project:debug`

PS : Les valeurs par défaut des variables peuvent être définies dans les fichiers docker-compose.<env>.yml

## Comment lire et modifier les fichiers de configuration secrète ?

Pour déchiffrer un fichier de configuration secrète : `yarn run config:decrypt`,
CONFIG_NAME et CONFIG_PASSWORD sont demandés, un fichier `config.<CONFIG_NAME>.secret.js` en clair est généré

Il est ensuite possible de modifier la configuration secrète, pour l'appliquer il faut la chiffrer de nouveau

Pour chiffrer un fichier de configuration : `yarn run config:encrypt`,
CONFIG_NAME et CONFIG_PASSWORD sont demandés, un fichier `config.<CONFIG_NAME>.secret.js.enc` chiffré est généré

