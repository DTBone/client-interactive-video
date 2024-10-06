/* eslint-disable react/prop-types */
import '~/index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import GitHubCallback from '../GitHubCallBack';

function GitHubLoginButton({window}) {
  var isProcessing = false;
  const loginWithGitHub = () => {
    isProcessing = true;
    // const clientID = 'Ov23liIJcIj0tgbzdR0m';
    // const redirectURI = 'http://localhost:3000/auth/github/callback';
    // window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientID}&redirect_uri=${redirectURI}`;
    window.location.href = 'http://localhost:3000/auth/github';
};
  return ( 
    <div onClick={loginWithGitHub} className='h-full bg-white rounded p-1 flex flex-row gap-2 items-center justify-center'>
        <FontAwesomeIcon icon={ faGithub} size='lg'/>
        {isProcessing ? <GitHubCallback/> : 'GITHUB'}
      {/* <GitHubLogin
        clientId='Ov23liIJcIj0tgbzdR0m'
        scope='user'
        redirectUri='http://localhost:5173/auth/github/callback'
        buttonText='GITHUB'
        onSuccess={success}  // Truyền hàm callback
        onError={error}      // Truyền hàm callback
      /> */}
    </div>
  );
}

export default GitHubLoginButton;