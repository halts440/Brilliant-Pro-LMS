import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"

function AttemptAssessment(props) {
    const navigate = useNavigate();
    const myParams = useParams();
    const assessmentid = myParams.assessmentid;
    const courseid = myParams.courseid;
    const [currState, setCurrState] = useState('not-started');
    const [name, setName] = useState('');
    const [duration, setDuration] = useState(0);
    const [minPassing, setMinPassing] = useState(0);
    const [questions, setQuestions] = useState([]);
    const [questionIndex, setQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(-1);
    const [userAnswers, setUserAnswers] = useState([]);

    const [numCorrect, setNumCorrect] = useState(0);
    const [percentage, setPercentage] = useState(0);
    const [passingStatus, setPassingStatus] = useState('');

    const [examTime, setExamTime] = useState('');
    const [countDownTimer, setCountDownTimer] = useState(null);

    function getAssessmentData() {
        // get course materials and assessments data
        fetch('http://localhost:4000/api/assessments/'+assessmentid, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json' },
        })
        .then(response => response.json() )
        .then(data => {
            if(data.status === 'success') {
                //console.log(data)
                setName( data.assessment.assessmentName )
                setDuration( parseInt(data.assessment.duration) )
                setMinPassing( parseInt(data.assessment.minPassing) )
                setQuestions(data.assessment.questions)
            }
        })
        .catch( (err) => {
            console.log("An error occured", err);
        })
    }

    useEffect( () => {
        getAssessmentData()
    }, [])

    function handleChange(event) {
        setSelectedOption(event.target.value);
      }

    function getAssessmentResult() {
        const data = {
            'course_id': courseid,
            'assessment_id': assessmentid,
            'learner_id': localStorage.getItem('userid'),
            'questions': questions,
            'user_answers': userAnswers,
            'min_passing': minPassing
        }
        // get course materials and assessments data
        fetch('http://localhost:4000/api/assessments/user-attempt', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' },
            body: JSON.stringify(data)
            })
        .then(response => response.json() )
        .then(data => {
            console.log(data);
            if(data.status === 'success') {
                setNumCorrect(data.data.correct)
                setPercentage(data.data.percentage)
                setPassingStatus(data.data.passing_status)
            }
        })
        .catch( (err) => {
            console.log("An error occured", err);
        })
    }
    
    return (<div>
        <h1>{name}</h1>
        <p>Duration: {duration}</p>
        <p>Minimum Passing Percentage: {minPassing}%</p>
        {
            currState === 'started' && <div>
                <p>{examTime.toLocaleString()}</p>
            </div>
        }
        {
            currState === 'not-started' && <div>
            <p>Guidelines:</p>
            <ul>
                <li>You will have total {questions.length} questions.</li>
                <li>You will given {duration} mins to complete this assessment.</li>
                <li>You can attempt all questions, skip any question or finish the assessment before time.</li>
                <li>Once the assessment is finish you can see the result</li>
            </ul>
            <button className="btn btn-primary"
                onClick={ () => {
                    setCurrState('started')
                
                    var currentTime = new Date();
                    var countDownDate = new Date( currentTime.getTime() + duration * 60000 ).getTime();
                    
                    var x = setInterval(function() {
                        var now = new Date().getTime();
                        var distance = countDownDate - now;

                        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
                        var timeStr = ''+hours+':'+minutes+':'+seconds
                        setExamTime(timeStr)
                        
                        if (distance < 0) {
                            console.log('Interval Cleared')
                            clearInterval(x);
                            selectedOption !== -1 ?
                                userAnswers.push(selectedOption):
                                userAnswers.push(-1);
                            setQuestionIndex(questionIndex+1)
                            if(questionIndex < questions.length-1) {
                                for(var i=questionIndex; i<questions.length-1; i++) {
                                    userAnswers.push(-1)
                                    setQuestionIndex(questionIndex+1)
                                }
                            }    
                            setCurrState('finsihed');
                            getAssessmentResult(); 
                        }
                    }, 1000)
                    setCountDownTimer(x)
                }}
            >Start Assessment</button>
            </div>
        }
        {
            currState === 'started' && <div>
                <h6>{questions[questionIndex].statement}</h6>
                <ul onChange={handleChange}>
                    <li> <input type="radio" value="0" name="options" /> {questions[questionIndex].options[0]} </li>
                    <li> <input type="radio" value="1" name="options" /> {questions[questionIndex].options[1]} </li>
                    <li> <input type="radio" value="2" name="options" /> {questions[questionIndex].options[2]} </li>
                    <li> <input type="radio" value="3" name="options" /> {questions[questionIndex].options[3]} </li>
                </ul>
                {
                    questionIndex !== questions.length-1 &&
                    <button className="btn btn-primary m-2" onClick={ 
                        () => {
                            selectedOption !== -1 ?
                                userAnswers.push(selectedOption):
                                userAnswers.push('-1');
                            setSelectedOption(-1);
                            document.getElementsByName('options').forEach( (elem) => elem.checked = false );
                            setQuestionIndex(questionIndex+1)
                        }
                    }>Next</button>
                }
                <button className="btn btn-primary"
                    onClick={ () => {
                        console.log(countDownTimer)
                        clearInterval(countDownTimer)
                        selectedOption !== -1 ?
                            userAnswers.push(selectedOption):
                            userAnswers.push('-1');
                        setQuestionIndex(questionIndex+1)
                        if(questionIndex < questions.length-1) {
                            for(var i=questionIndex; i<questions.length-1; i++) {
                                userAnswers.push('-1')
                                setQuestionIndex(questionIndex+1)
                            }
                        }     
                        setCurrState('finished')  
                        getAssessmentResult();        
                    }}
                >Finish</button>
                
            </div>
        }
        {
            currState === 'finished' && <div>
                <p>Total Questions: {questions.length}</p>
                <p>Total Correctly Answered: {numCorrect}</p>
                <p>Total Wrong Answered: { questions.length- numCorrect}</p>
                <p>Percentage: {percentage}</p>
                <p>Assessment Status: { passingStatus }</p>
                <button
                    className="btn btn-primary"
                    onClick={ () => navigate('/learner/courses/'+courseid, {replace: true}) }
                >Go Back</button>
            </div>
        }
        
    </div>)
}


export default AttemptAssessment;
