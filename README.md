# chat-app
A docker web chatroom application ready to be built using docker compose and ran on any linux machine

# usage
It is required to have a relatively new version of docker installed (one that supports docker compose)\
To run the project, simply run 
```shell
cd app && docker compose up
```
#### Note:
You will need to either be in the docker group on your machine or run docker compose up using sudo.
The docker group is usually automatically created on docker installation, to become a part of the docker group run   
```shell
sudo usermod -aG docker $USER
```
This will add the current user to the docker group.  

# todo:
- modify the UI so that messages are displayed in a box
- remove certain annoying margins (frontend)
- add a favicon (frontend)
- add verification for empty messages (backend)
- add error handling (backend and frontend)
- move database functions to a separate file and only import them (backend)
- implement login.html (frontend)
- require an username to post, user signs their messages with a hash generated from the username
- make a cool way to represent the hash
