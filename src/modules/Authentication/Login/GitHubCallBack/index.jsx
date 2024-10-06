import { useEffect } from 'react';
function GitHubCallback() {
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        if (code) {
            // Send code to backend
            fetch('http://localhost:3000/auth/github/callback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code }),
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);
            });
        }
    }, []);

    return <div>Processing GitHub login...</div>;
}
export default GitHubCallback;