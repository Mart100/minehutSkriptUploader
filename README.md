# MinehutSkriptUploader

MinehutSkriptUploader is an easy way to hotreload and upload skript files to your minehut server.


### Installation

MinehutSkriptUploader requires [Node.js](https://nodejs.org/) v4+ to run.

Install the package with npm:

```sh
$ npm install minehutskriptuploader -g
```

### Usage

##### Options
-r : To immediatly reload the skript in your server

##### Login:

```sh
$ mhsu login [email] [password]
```

##### Upload:
```sh
$ mhsu upload [fileName]
```

##### Watch:
```sh
$ mhsu watch [fileName]
```
###### Or watch a whole directory for file changes:
```sh
$ mhsu watch ./
```

### Examples
```sh
$ mhsu login martvanenck1@gmail.com hunter12
$ mhsu upload sidebar.sk
$ mhsu watch ./ -r
```