import { useState } from "react";
import AdminNavigation from "./AdminNavigation";
import { Check2 } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

function AddAssessment(props) {
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
    
    function handleSubmit(event) {
        event.preventDefault();
        const data = {
            'assessmentName': assessmentName,
            'duration': duration,
            'minPassing' : minPassing,
            'questions': questions,
        }
        fetch('http://localhost:4000/api/assessments/add', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            })
            .then(response => response.json() )
            .then(data => {
                if( data.status === 'success') {
                    console.log('Assessment added successfully')
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
            <div className="pb-5">
            <h2 className="cheader">Add Assessment</h2>

            <div className="container-80 d-flex">
                <div className="w-50">
                    <form onSubmit={handleSubmit}>
                        <table>
                            <tbody>
                                <tr>
                                    <td><label>Name: </label></td>
                                    <td><input type='text' name='assessmentName' value={assessmentName} onChange={handleChange}/></td>
                                </tr>

                                <tr>
                                    <td><label>Duration (min): </label></td>
                                    <td><input type='text' name='duration' value={duration} onChange={handleChange}/></td>
                                </tr>

                                <tr>
                                    <td><label>Min Passing %: </label></td>
                                    <td><input type='number' min={60} max={100} name='minPassing' value={minPassing} onChange={handleChange}/></td>
                                </tr>

                                <tr>
                                    <td></td>
                                    <td>
                                        <input
                                        className="btn btn-primary"
                                        type="submit" value="Add Assessment"></input>
                                    </td>
                                </tr>

                            </tbody>
                        </table>
                        </form>
                    
                    <br /><br />
                    <div>
                        <table>
                            <tbody>
                                <tr>
                                    <td><label>Statement: </label></td>
                                    <td><input type='text' name='statement' value={statement} onChange={handleChange}/></td>
                                </tr>

                                <tr>
                                    <td><label>Option 1: </label></td>
                                    <td><input type='text' name='option1' value={option1} onChange={handleChange}/></td>
                                </tr>

                                <tr>
                                    <td><label>Option 2: </label></td>
                                    <td><input type='text' name='option2' value={option2} onChange={handleChange}/></td>
                                </tr>

                                <tr>
                                    <td><label>Option 3: </label></td>
                                    <td><input type='text' name='option3' value={option3} onChange={handleChange}/></td>
                                </tr>

                                <tr>
                                    <td><label>Option 4: </label></td>
                                    <td><input type='text' name='option4' value={option4} onChange={handleChange}/></td>
                                </tr>

                                <tr>
                                    <td><label>Correct Option: </label></td>
                                    <td><select name="correctOpt" value={correctOpt} onChange={handleChange}>
                                        <option value='0'>Option 1</option>
                                        <option value='1'>Option 2</option>
                                        <option value='2'>Option 3</option>
                                        <option value='3'>Option 4</option>
                                    </select></td>
                                </tr>

                                <tr>
                                    <td></td>
                                    <td>
                                    {
                                        addOrUpdate === 'add' &&
                                        <button
                                            className="btn btn-primary"
                                        onClick={addQuestion}>Add Question</button>
                                    }
                                    {
                                        addOrUpdate === 'update' &&
                                        <button
                                            className="btn btn-primary"
                                        onClick={ updateQuestion }>Update Question</button>
                                    }
                                    </td>
                                </tr>
                            </tbody>
                        </table>                        
                    </div>
                </div>
                <div className="w-50">
                    <div>{
                        questions.map( (q, index) => (
                            <div key={index}>
                                <h5>Q.No.{index+1} {q.statement}
                                <button className="btn" onClick={ () => editQuestion(index) }>Edit</button>
                                <button className="btn" onClick={ () => deleteQuestion(index) }  >Delete</button>
                                </h5>
                                { q.options.map( (v, i) => (<p key={i}>{i+1}- {v}{ q.correctOpt == i && <Check2/>}</p>)) }
                            </div>
                        ))
                    }</div>
                </div>
            </div>
            </div>
        </div>
    )
}

export default AddAssessment;