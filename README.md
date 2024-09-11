# chat-app
A docker web chatroom application ready to be built into an image and ran on any linux machine

# usage
It is required to have a relatively new version of docker installed (one that supports docker compose)\
To run the project, simply run 
```bash
cd app && docker compose up
```
<h4>Note:</h4> You will need to either be in the docker group on your machine or run docker compose up using sudo. <br/><br/>

# todo:
- create a proper box layout, make messages aligned left (frontend)
- remove certain annoying margins (frontend)
- add error handling (backend and frontend)
- move database functions to a separate file and only import them (backend)
- require an username to post, user signs their messages with a hash generated from the username
- make a cool way to represent the hash
