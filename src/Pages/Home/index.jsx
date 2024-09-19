import styles from './Home.module.scss';
import CoursesLayout from '../../components/OurCourses';
function Home() {

    const courses = [
        {
            id: 1,
            title: 'Introduction to C++',
            description: 'Learn the basics of C++ programming',
            image: 'https://giaiphapso.com/wp-content/uploads/2021/08/cplusplus.png',
        },
        {
            id: 2,
            title: 'Introduction to Python',
            description: 'Learn the basics of Python programming',
            image: 'https://giaiphapso.com/wp-content/uploads/2021/08/cplusplus.png',
        },
        {
            id: 3,
            title: 'Introduction to Java',
            description: 'Learn the basics of Java programming',
            image: 'https://giaiphapso.com/wp-content/uploads/2021/08/cplusplus.png',
        },
        {
            id: 4,
            title: 'Introduction to JavaScript',
            description: 'Learn the basics of JavaScript programming',
            image: 'https://giaiphapso.com/wp-content/uploads/2021/08/cplusplus.png',
        },
        {
            id: 5,
            title: 'Introduction to Python',
            description: 'Learn the basics of Python programming',
            image: 'https://giaiphapso.com/wp-content/uploads/2021/08/cplusplus.png',
        },
        {
            id: 6,
            title: 'Introduction to Java',
            description: 'Learn the basics of Java programming',
            image: 'https://giaiphapso.com/wp-content/uploads/2021/08/cplusplus.png',
        }
    ];

    return ( 
    <>
    <div className={styles.container}>
        <div className={styles.leftContent}>
            <div className={styles.content} >
                <h1>CodeChef</h1>
                <p>CodeChef is a competitive programming community of programmers from across the globe. CodeChef was created as a platform to help programmers make it big in the world of algorithms, computer programming, and programming contests.</p> 
            </div>
            <button>Get Started</button>
        </div>
        <div className={styles.rightContent}>
            <img src="src/assets/image_code.png" alt="home" />
        </div>
    </div>
    <CoursesLayout courses={courses} title="Our Courses" isFilter={true}/>
    </>
     );
}

export default Home;