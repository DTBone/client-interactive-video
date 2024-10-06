/* eslint-disable react/prop-types */

import '~/index.css';
function HomeUser({user}) {
    
    if(!user) {
        user = {}
    }
    return ( 
        <div className='h-full'>
            <h1>Welcome {user.profile.fullname}</h1>
            <p>Your email is {user.email}</p>
        </div>
     );
}

export default HomeUser;