# WaterProofing data Webportal Client

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.1.0.

## Getting the project

Clone the repository locally:

```sh
git clone -b develop https://gitlab.gistools.geog.uni-heidelberg.de/waterproofing-data/webportal_client.git wpd_client
```

*Remember that you have to checkout in the develop branch, which is the working branch*  

### Repository workflow good practices ###

The repository workflow for the project have two main branches:

 * master (where the stable/production versions are stored)
 * develop (where the working versions are stored)
 * feature/my-feature-name (local only branches of a working feature)
 * fix/my-bug-fixes (local only branches of a working bug fixes)


### Development 

- Run `npm install` to install all dependencies.
- Run `npm run start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Build

- Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory. 
- Use the `npm run build:prod` for a production build.

## Deployment

- Login to Server

```
ssh mkhan@waterprofing.geog.uni-heidelberg.de
```


- Create back of running server and client
```
mkdir ~/wpd/backup/client_dist_<date> 
cp -rf ~/wpd/client/dist/* ~/wpd/backup/client_dist_<date>
```


- Delete existing build files
```
cd ~/wpd/client/dist/client/
rm -r *
```


- Delete existing deployed files

```
sudo rm -r /var/www/html/webportal/*
```


- Build the code locally on your machine and send it to the server
```
npm run build:prod
cd dist/client
scp -r * mkhan@waterproofing.geog.uni-heidelberg.de:/home/m/mkhan/wpd/client/dist/client
```


- OR Build it on server
```
cd ~/wpd/client/
git pull
npm run build:prod
cd dist/client
```


- Replaced existing client application
```
cd ~/wpd/client/dist/client/
sudo cp -r * /var/www/html/webportal/
```


## Further help

For any bugs or future enhancements open an [issue](https://gitlab.gistools.geog.uni-heidelberg.de/giscience/big-data/ohsome/apps/osmatrix-ohsome/osmatrix-client-ohsome/issues) and label it as `Bug` or `Ideas` respectively. For any other queries contact Mohammed Rizwan Khan <rizwan@uni-heidelberg.de>.
