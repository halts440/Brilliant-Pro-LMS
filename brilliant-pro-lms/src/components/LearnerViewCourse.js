import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function LearnerViewCourse(props) {
    const myparams = useParams()
    const [materialsProgress, setMaterialsProgress] = useState([])
    const [assessmentProgress, setAssessmentProgress] = useState([])
    const [materials, setMaterials] = useState([])
    const [assessments, setAssessments] = useState([])
    const [allMaterials, setAllMaterials] = useState([])
    const [allAssessments, setAllAssessments] = useState([])

    function getData() {
        // get course materials and assessments data
        fetch('http://localhost:4000/api/courses/'+myparams.course_id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json' },
            })
            .then(response => response.json() )
            .then(data => {
                if(data.status === 'success') {
                    console.log(data)
                    setMaterials(data.course.materials)
                    setAssessments(data.course.assessments)
                }
            })
            .catch( (err) => {
                console.log("An error occured", err);
            })

        // get user progress data
        fetch('http://localhost:4000/api/learnerprogress/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json' },
            })
            .then(response => response.json() )
            .then(data => {
                if(data.status === 'success') {
                    console.log(data)
                    setMaterials(data.course.materials)
                    setAssessments(data.course.assessments)
                }
            })
            .catch( (err) => {
                console.log("An error occured", err);
            })
    }

    useEffect( () => {
        getData()
    }, [])

    return (
        <div>
        </div>
    )
}

export default LearnerViewCourse;