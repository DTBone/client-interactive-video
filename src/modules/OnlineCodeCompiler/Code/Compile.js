import Axios from 'axios';

function compile({ setLoading, setUserOutput, userCode, userLang, userInput }) {
    setLoading(true);
    if (userCode === ``) {
        return
    }

    // Post request to compile endpoint
    Axios.post(`http://localhost:8000/compile`, {
        code: userCode,
        language: userLang,
        input: userInput
    }).then((res) => {
        setUserOutput(res.data.stdout || res.data.stderr);
    }).then(() => {
        setLoading(false);
    }).catch((err) => {
        console.error(err);
        setUserOutput("Error: " + (err.response ? err.response.data.error : err.message));
        setLoading(false);
    });
}

export default compile;