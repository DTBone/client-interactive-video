/* eslint-disable react/prop-types */

import '~/index.css';
function RoadMap({user}) {
    
    if(!user) {
        user = {}
    }
    return ( 
        <div className='h-full'>
            <p>Your email is {user.email}</p>
            <h1>Welcome {user.profile.fullname}</h1>
        </div>
     );
}

export default RoadMap;