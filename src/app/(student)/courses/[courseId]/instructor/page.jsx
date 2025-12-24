"use client";
export default function CourseInstructor() {
    const [ instructor, setInstructor ] = useState(null);
    const { courseId } = useParams();

    useEffect(() => {
        const fetchInstructor = async () => {
            try {
                const session = await getSession();
                const res = await fetch(`http://localhost:8000/api/method/lms_app.api.course.get_course_instructor?courseId=${courseId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        "Authorization": `Bearer ${session?.user?.accessToken}`,
                    },
                });
                const response = await res.json();
                setInstructor(response.data);
            } catch (error) {
                console.error("Error fetching instructor:", error);
            }
        };

        fetchInstructor();
    }, [])
    return (
        <div>
            Instructor Page
        </div>
    );
}