const MAX_MESSAGES = 3

list = document.getElementById('msgList');

for(let i = 0; i < MAX_MESSAGES; i++)
{
    var li = document.createElement('li');
    list.appendChild(li);
}

async function setup() {
    let req;
    await fetch('/api/get')
	.then(response => response.json())
	.then(data => req = data);
    const items = list.getElementsByTagName('li');
    for (let i = 0; i < req.length; i++) 
    {
	items[i].textContent = req[i];
    }
}

setInterval(async () => {setup()}, 100);