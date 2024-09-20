import '~/index.css';
import { useSearchParams } from 'react-router-dom';
function HomeUser() {
    const [params] = useSearchParams();
    const userid = params.get('userid');
    const users = [
        {
            id: 1,
            name: 'John',
            email: 'aa'
        },
        {
            id: 2,
            name: 'Doe',
            email: 'aa'
        }
    ]
    const user = users.find(user => user.id === parseInt(userid));
    return ( 
        <div className='h-full'>
            <h1>Welcome {user.name}</h1>
            <p>Your email is {user.email}</p>
        </div>
     );
}

export default HomeUser;