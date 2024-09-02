function post(event)
{
    const inputString = document.getElementById('messageform').value;

    fetch('/api/post/' + inputString)
	.then(response => response.json());
    console.log('Submitted value:', inputValue);
}
