import { useEffect, useState } from "react";
import AdminNavigation from "./AdminNavigation";
import { Check2 } from "react-bootstrap-icons";
import { useNavigate, useParams } from "react-router-dom";

function ViewAssessment(props) {
    const myparams = useParams()
    const navigate = useNavigate()
    const [questions, setQuestions] = useState([])
    const [assessmentName, setAssessmentName] = useState([])
    const [duration, setDuration] = useState('')
    const [minPassing, setMinPassing] = useState(1)
    const [statement, setStatement] = useState('')
    const [option1, setOption1] = useState('')
    const [option2, setOption2] = useState('')
    const [option3, setOption3] = useState('')
    const [option4, setOption4] = useState('')
    const [correctOpt, setCorrectOpt] = useState('0')
    const [addOrUpdate, setAddOrUpdate] = useState('add')
    const [editIndex, setEditIndex] = useState(0)
    const [editOpt, setEditOpt] = useState(false)

    function handleShowEdit() {
        setEditOpt(true)
    }

    useEffect( () => {
        fetch('http://localhost:4000/api/assessments/'+myparams.id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json' },
            })
            .then(response => response.json() )
            .then(data => {
                console.log(data)
                if(data.status === 'success') {
                    setQuestions(data.assessments.questions)
                    setAssessmentName(data.assessments.assessmentName)
                    setDuration(data.assessments.duration)
                    setMinPassing(data.assessments.minPassing)
                }
            })
            .catch( (err) => {
                console.log("An error occured", err);
            })
    }, [])
    
    function handleSubmit(event) {
        event.preventDefault();
        const data = {
            'assessmentName': assessmentName,
            'duration': duration,
            'minPassing' : minPassing,
            'questions': questions,
        }
        fetch('http://localhost:4000/api/assessments/update/'+myparams.id, {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            })
            .then(response => response.json() )
            .then(data => {
                if( data.status === 'success') {
                    console.log('Assessment updated successfully')
                    navigate('/admin/assessments', {replace: true})
                }
                console.log('Success:', data);
            });
    }

    function handleChange(event) {
        const value = event.target.value;
        const name = event.target.name;
        if(name === 'assessmentName')
            setAssessmentName(value)
        if(name === 'duration')
            setDuration(value)
        if(name === 'minPassing')
            setMinPassing(value)
        else if(name === 'option1')
            setOption1(value)
        else if(name === 'option2')
            setOption2(value)
        else if(name === 'option3')
            setOption3(value)
        else if(name === 'option4')
            setOption4(value)
        else if(name === 'statement') 
            setStatement(value)
        else if(name === 'correctOpt')
            setCorrectOpt(value)
    }

    function addQuestion() {
        const ques = {
            'statement': statement,
            'options': [option1, option2, option3, option4],
            'correctOpt': correctOpt
        }
        const newQuestions = questions
        newQuestions.push(ques)
        setQuestions(newQuestions)
        // clear older question
        setStatement('')
        setOption1('')
        setOption2('')
        setOption3('')
        setOption4('')
        setCorrectOpt('0')
    }

    function editQuestion(index) {
        var q = questions[index]
        setStatement(q.statement)
        setOption1(q.options[0])
        setOption2(q.options[1])
        setOption3(q.options[2])
        setOption4(q.options[3])
        setCorrectOpt(q.correctOpt)
        setAddOrUpdate('update')
        setEditIndex(index)
    }

    function updateQuestion() {
        const ques = {
            'statement': statement,
            'options': [option1, option2, option3, option4],
            'correctOpt': correctOpt
        }
        const newQuestions = questions
        newQuestions[editIndex] = ques
        setQuestions(newQuestions)
        // clear older question
        setStatement('')
        setOption1('')
        setOption2('')
        setOption3('')
        setOption4('')
        setCorrectOpt('0')
        setAddOrUpdate('add')
    }

    function deleteQuestion(index) {
        var new_questions_list = questions.filter( (v, i) => i != index )
        setQuestions(new_questions_list)
    }

    return (
        <div>
            <AdminNavigation />
            <h2>View Assessment
                {
                    !editOpt && <div>
                        <button className="btn btn-primary" onClick={
                            () => handleShowEdit()
                        }>Edit</button>
                    </div>
                }
            </h2>

            <div className="d-flex">
            <div className="w-50">
                    <div>{
                        questions.map( (q, index) => (
                            <div key={index}>
                                <h5>Q.No.{index+1} {q.statement}
                                {   editOpt && <div>
                                        <button className="btn" onClick={ () => editQuestion(index) }>Edit</button>
                                        <button className="btn" onClick={ () => deleteQuestion(index) }  >Delete</button>
                                    </div>
                                }
                                </h5>
                                { q.options.map( (v, i) => (<p key={i}>{i+1}- {v}{ q.correctOpt == i && <Check2/>}</p>)) }
                            </div>
                        ))
                    }</div>
                </div>

                <div className="w-50">
                    <form onSubmit={handleSubmit}>
                        {
                            !editOpt && 
                            <div><p>Name: {assessmentName}</p></div>
                        }
                        {
                            editOpt && <div>
                                <label>Name: </label>
                                <input type='text' name='assessmentName' value={assessmentName} onChange={handleChange}/><br/>
                            </div>
                        }
                        {
                            !editOpt &&
                            <div><p>Duration (minutes): {duration}</p></div>
                        }
                        {
                            editOpt && <div>
                                <label>Duration (minutes): </label>
                                <input type='text' name='duration' value={duration} onChange={handleChange}/><br/>
                            </div>
                        }
                        {
                            !editOpt &&
                            <div><p>Min Passing: {minPassing}</p></div>
                        }
                        {
                            editOpt &&
                            <div>
                                <label>Min Passing: </label>
                                <input type='number' min={1} max={questions.length} name='minPassing' value={minPassing} onChange={handleChange}/><br/>
                            </div>
                        }
                        {
                            editOpt &&
                            <div><input type="submit" value="Update Assessment"></input><br/></div>
                        }
                    </form>

                    <br /><br />
                    { editOpt &&
                    <div>
                        <label>Statement: </label>
                        <input type='text' name='statement' value={statement} onChange={handleChange}/><br/>
                        
                        <label>Option 1: </label>
                        <input type='text' name='option1' value={option1} onChange={handleChange}/><br/>
                        <label>Option 2: </label>
                        <input type='text' name='option2' value={option2} onChange={handleChange}/><br/>
                        <label>Option 3: </label>
                        <input type='text' name='option3' value={option3} onChange={handleChange}/><br/>
                        <label>Option 4: </label>
                        <input type='text' name='option4' value={option4} onChange={handleChange}/><br/>
                        
                        <label>Correct Option: </label>
                        <select name="correctOpt" value={correctOpt} onChange={handleChange}>
                            <option value='0'>Option 1</option>
                            <option value='1'>Option 2</option>
                            <option value='2'>Option 3</option>
                            <option value='3'>Option 4</option>
                        </select>
                        <p>{correctOpt}</p>
                        {
                            addOrUpdate === 'add' &&
                            <button onClick={addQuestion}>Add Question</button>
                        }
                        {
                            addOrUpdate === 'update' &&
                            <button onClick={ updateQuestion }>Update Question</button>
                        }
                        
                    </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default ViewAssessment;