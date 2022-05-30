import React from 'react';

class EditCourse extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            code: '',
            name: '',
            overview: '',
            image: '',
            startDate: '',
            endDate: '',
            enrollmentLink: '',
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        const value = event.target.value;
        const name = event.target.name;
        this.setState({
            [name]: value
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        const data = {
            'code': this.state.code,
            'name': this.state.name,
            'overview' : this.state.overview,
            'image': this.state.image,
            'startDate': this.state.startDate,
            'endDate': this.state.endDate,
            'enrollmentLink' : this.state.enrollmentLink,
        }
        fetch('http://localhost:4000/courses/create', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            })
            .then(response => response)
            .then(data => {
                console.log('Success:', data);
            });
    }

    render() {
        return (
            <div>
                <h1>Edit Course</h1>
                <form onSubmit={this.handleSubmit}>

                    <label>Code</label><br/>
                    <input type='text' name='code' value={this.state.code} onChange={this.handleChange}/><br/>

                    <label>Name</label><br/>
                    <input type='text' name='name' value={this.state.name} onChange={this.handleChange}/><br/>
                    
                    <label>Overview</label><br/>
                    <textarea name='overview' value={this.state.overview} onChange={this.handleChange}/><br/>

                    <label>Image</label><br/>
                    <img src={this.state.image} alt='ProfilePicture' /><br/>

                    <label>Start Date</label><br/>
                    <input type='date' name='startDate' value={this.state.startDate} onChange={this.handleChange}/><br/>
                    
                    <label>End Date</label><br/>
                    <input type='date' name='endDate' value={this.state.endDate} onChange={this.handleChange}/><br/>

                    <label>Enrollment Link</label><br/>
                    <input type='text' name='enrollmentLink' value={this.state.enrollmentLink} onChange={this.handleChange}/><br/>
                    
                    <input type='submit' value='Sign Up'></input><br></br>
                </form>
            </div>
        );
    }
};

export default EditCourse;