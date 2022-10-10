# Getting the project

Clone the repository locally:

```sh
git clone -b develop https://gitlab.gistools.geog.uni-heidelberg.de/waterproofing-data/webportal_server.git wpd_server
```

*Remember that you have to checkout in the develop branch, which is the working branch*  

### Repository workflow good practices ###

The repository workflow for the project have two main branches:

 * master (where the stable/production versions are stored)
 * develop (where the working versions are stored)
 * feature/my-feature-name (local only branches of a working feature)
 * fix/my-bug-fixes (local only branches of a working bug fixes)

### Development setup
```
npm install
npm run dev
```

# Production setup


### Run postgis docker 

```
docker run --name=pgWpdWiki -d -e POSTGRES_USER=admin -e POSTGRES_PASS=admin -e POSTGRES_DBNAME=wpdWiki -e ALLOW_IP_RANGE=0.0.0.0/0 -p 25432:5432 -v /home/khan/workspace/wpd/server/pg_data:/var/lib/postgresql --restart=always kartoza/postgis:9.6-2.4
```


### Run wikijs docker by supplying postgis credentials

```
docker run -d -p 8080:3000 --name wiki --restart unless-stopped -e "DB_TYPE=postgres" -e "DB_HOST=172.17.0.1" -e "DB_PORT=25432" -e "DB_USER=admin" -e "DB_PASS=admin" -e "DB_NAME=wpdWiki" requarks/wiki:2
```

*DB_HOST=< docker ip address where db container is running >*

open localhost:8080 in browser and do installation steps

### Run Geoserver docker

```
docker run -d -p 8600:8080 --name geoserverWpd -e SAMPLE_DATA=true -e COMMUNITY_EXTENSIONS=ogr-datastore-plugin kartoza/geoserver:2.16.2
```

# Deployment

- Login 
`ssh <username>@waterprofing.geog.uni-heidelberg.de`

- Create back of running server and client
```
mkdir ~/wpd/backup/server_<date> 
cp -rf ~/wpd/server/* ~/wpd/backup/server_<date>
```

- Get the latest code from git

```
cd ~/wpd/server
git pull
```

#### Start the server as standlone
~~npm run start~~

~~nohup npm run start > output.log &~~

> ref: To run server in background https://www.dev2qa.com/how-to-run-node-js-server-in-background/
> if gets an error saying port in use can use $pkill -f node and $pkill -f nodejs to kill all node server
> ref: https://stackoverflow.com/questions/31649267/how-to-kill-a-nodejs-process-in-linux

Using [pm2 for running app](https://www.digitalocean.com/community/tutorials/how-to-use-pm2-to-setup-a-node-js-production-environment-on-an-ubuntu-vps) So that app server restarts when shutsdown unexpectedly

To start app server (required only first time)

```
cd ~/wpd/server/
pm2 start app/server.js
```

Use this command to know the status, pid, etc 

```
pm2 status
```

To stop app in pm2 

```
pm2 stop <id>
```

Applicaton logs are stored at `cat /home/m/mkhan/.pm2/logs/server-out.log`

and error logs at `cat /home/m/mkhan/.pm2/logs/server-error.log`

To see logs 

```
pm2 log
```

To see monitoring tool with other server details

```
pm2 monit
```

#### OR Run server as Docker container

To Build an image
```
docker build -t wpd/api-server .
```

Create container by
```
docker run -p 9090:8080 -v $PWD:/usr/src/app --name wpd-server -d wpd/api-server
```

### Starting other Docker Container

- Start Database docker conatiner
```
sudo docker start pgWpdWiki2
```

- start wiki server
```
sudo docker start wiki2
```

- start geoserver 
```
sudo docker start geoserverWpd
```

- ensure that db server was started first, because in wiki's env_variables ip of Db server is given as 172.17.0.2
- to check env_variables used while docker run command 
```
docker exec <container_id> bash -c 'echo "$ENV_VAR"'
```

- to check the ips of all containers inside "bridge" connections 
```
sudo docker network inspect bridge 
```

### Transfering Shapefiles to Geoserver

- Transfer file from your local machine to server by
```
scp <FilesToSend> mkhan@waterproofing.geog.uni-heidelberg.de:/home/m/mkhan/wpd/spatial_data
```

> Currently we are using `/home/m/mkhan/wpd/spatial_data` folder to place all our data files

- Copy the files into Geoserver container
```
sudo docker ps -a
```

- Take the Geoserver's Container ID and 
```
sudo docker cp <SourceFileToCopy> <GeoserverContainerID>:<FileLocation>
```

- Get into Geoserver conatiner
```
sudo docker exec -it geoserverWpd bash
```

> Get the data directory where we are storing the data for Geoserver
> `echo $GEOSERVER_DATA_DIR`
> should return you something like 
> `/opt/geoserver/data_dir/data`

## Step for changing max file size to upload eg: images, videos
- Get into wiki conatiner
```
sudo docker exec -it wiki2 bash
```

- Edit file name config.yml residing at /wiki in wiki container
```
vi config.yml

// change the file size as required here
uploads:      
  maxFileSize: 20971520
  maxFiles: 10 
```

> Further info at https://docs.requarks.io/install/config#upload-limits

## Further help

For any bugs or future enhancements open an [issue](https://gitlab.gistools.geog.uni-heidelberg.de/waterproofing-data/webportal_server/-/issues) and label it as `Bug` or `Ideas` respectively. For any other queries contact Mohammed Rizwan Khan <rizwan@uni-heidelberg.de>.
