# chat-app
A docker web chatroom application ready to be built using docker compose and ran on any linux machine

# usage
It is required to have a relatively new version of docker installed (one that supports docker compose)\
To run the project, simply run 
```shell
cd app && docker compose up
```
Note:\
You will need to either be in the docker group on your machine or run docker compose up using sudo. The docker group is usually automatically created on docker installation, to become a part of the docker group run.

```shell
sudo usermod -aG docker $USER
```
This will add the current user to the docker group.

# todo-upgrades:
- rust dependency caching
- errors should not rely on sqlx::Error to be more general
- a script which allows for easy up/down/build
- fix the issue with the database not behaving properly when trying to implement a higher limit before cleanup
- debug endpoint for backend to allow testing the database and other backend stuff
- fix the page being scrollable for some reason
- make the message limit for the page modifiable
- add error handling (backend and frontend)
- remove certain annoying margins (frontend)
- make favicon change color with theme (frontend)

# todo-features
- modify the UI so that messages are displayed in a nicer way
- implement login.html (frontend)
- fix the site on mobile (frontend)
- require an username to post, user signs their messages with a hash generated from the username
- make a cool way to represent the hash
