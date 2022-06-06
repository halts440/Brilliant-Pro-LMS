import { useEffect, useState } from "react"

function CourseMaterials(props) {
    const [materialsList, setMaterialsList] = useState([])
    const [addedMaterials, setAddedMaterials] = useState([])

    function getMaterialsData() {
        fetch('http://localhost:4000/api/courses/'+props.id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json' },
            })
            .then(response => response.json() )
            .then(data => {
                console.log(data)
                if(data.status === 'success') {
                    setAddedMaterials(data.course.materialsList)
                }
            })
            .catch( (err) => {
                console.log("An error occured", err);
            })


        fetch('http://localhost:4000/api/materials', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json' },
            })
            .then(response => response.json() )
            .then(data => {
                console.log(data)
                if(data.status === 'success') {
                    setMaterialsList(data.materials)
                }
            })
            .catch( (err) => {
                console.log("An error occured", err);
            })        
    }

    useEffect( () => {
        getMaterialsData()
    }, [])

    function addCourseMaterial(courseId, materialId) {
        console.log("C: ", courseId)
        fetch('http://localhost:4000/api/courses/addCourseMaterial', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' },
            body: JSON.stringify({
                material: materialId,
                course: courseId
            })
            })
            .then(response => response.json() )
            .then(data => {
                console.log(data)
                if(data.status === 'success') {
                    getMaterialsData() 
                }
            })
            .catch( (err) => {
                console.log("An error occured", err);
            })
    }

    function removeCourseMaterial(courseId, materialId) {
        fetch('http://localhost:4000/api/courses/removeCourseMaterial', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' },
            body: JSON.stringify({
                material: materialId,
                course: courseId
            })
            })
            .then(response => response.json() )
            .then(data => {
                console.log(data)
                if(data.status === 'success') {
                    getMaterialsData()
                }
            })
            .catch( (err) => {
                console.log("An error occured", err);
            })
    }

    return (
        <div>
            {
                materialsList && materialsList.length > 0 && (
                    <table>
                        <tbody>{
                        materialsList.map( (elem, index) =>
                            <tr key={index}>
                                <td>{elem.filename}</td>
                                <td>
                                    { addedMaterials.includes(elem._id) && 
                                        (<button className="btn btn-danger" onClick={
                                            () => removeCourseMaterial(props.id, elem._id)
                                        }>Remove</button>)
                                    }
                                    {!addedMaterials.includes(elem._id) && 
                                        (<button className="btn btn-primary"
                                        onClick={
                                            () => addCourseMaterial(props.id, elem._id)
                                        }
                                        >Add</button>)
                                    }
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>

                )
            }
        </div>
    )
}

export default CourseMaterials;