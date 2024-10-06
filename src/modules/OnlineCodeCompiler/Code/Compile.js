import Axios from 'axios';

function compile({ setLoading, setUserOutput, userCode, userLang, userInput }) {

    console.log("Parameters:", { setLoading, setUserOutput, userCode, userLang, userInput });

    setLoading(true);
    if (userCode === ``) {
        return
    }

    // Post request to compile endpoint
    Axios.post(`http://localhost:8000/compile`, {
        code: userCode,
        language: userLang.toLowerCase(),
        input: userInput
    }).then((res) => {
        console.log("Compile Response:", res.data);

        const output = res.data.stdout || res.data.stderr;

        setUserOutput(output);

        // Cập nhật localStorage
        localStorage.setItem('userInput', userInput);
        localStorage.setItem('userOutput', output);


    }).then(() => {
        setLoading(false);
    }).catch((err) => {
        console.error(err);
        const errorOutput = "Error: " + (err.response ? err.response.data.error : err.message);
        setUserOutput(errorOutput);

        // Cập nhật localStorage
        localStorage.setItem('userInput', userInput);
        localStorage.setItem('userOutput', errorOutput);
    }).finally(() => {
        setLoading(false); // Đảm bảo loading tắt cả trong trường hợp thành công hoặc thất bại
    });
}

export default compile;