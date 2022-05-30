import { useState } from 'react';
import { PencilSquare, Trash } from 'react-bootstrap-icons';

function LearnersList(props) {
    const [allLearners, setAllLearners] = useState([]);

    return (
        <div>
            { allLearners.length > 0 && <div>
                <ul>
                    
                </ul>
            </div>}
            <PencilSquare color='green' size={25} />
            <Trash color='red' size={25} />
        </div>
    )
}
export default LearnersList;