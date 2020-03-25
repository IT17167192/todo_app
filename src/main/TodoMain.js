import 'date-fns';
import React, {Component} from 'react';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import DateFnsUtils from '@date-io/date-fns';
import TodoList from "./TodoList";
import Alert from "react-bootstrap/Alert";
import Snackbar from '@material-ui/core/Snackbar';
import Fade from '@material-ui/core/Fade';

import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers';

class TodoMain extends Component {

    constructor(props) {
        super(props);
        this.btn = React.createRef();
        this.todo = React.createRef();
    }

    state = {
        currentTask: {
            value: '',
            date: Date.now(),
            time: Date.now(),
            key: '',
            completed: false
        },
        allTasks: [],
        edit: false,
        editTaskKey: '',
        showError : false,
        showUpdateSuccess: false,
        Transition: Fade,
        openSnackBar: false
    };

    handleDateChange = date => {
        this.setState({
            currentTask: {
                value: this.state.currentTask.value,
                key: this.state.edit ? this.state.editTaskKey : this.state.currentTask.key,
                date: date,
                time: this.state.currentTask.date,
                completed: this.state.currentTask.completed
            },
            openSnackBar: false
        });
    };

    handleTimeChange = time => {
        this.setState({
            currentTask: {
                value: this.state.currentTask.value,
                key: this.state.edit ? this.state.editTaskKey : this.state.currentTask.key,
                date: this.state.currentTask.date,
                time: time,
                completed: this.state.currentTask.completed
            },
            openSnackBar: false
        });
    };

    onInputChangeHandler = event => {
        this.setState({
            currentTask: {
                value: event.target.value,
                key: this.state.edit ? this.state.editTaskKey : Date.now(),
                date: this.state.currentTask.date,
                time: this.state.currentTask.time,
                completed: this.state.currentTask.completed
            },
            showError: false,
            showUpdateSuccess: false,
            openSnackBar: false
        });
    };

    handleSubmit = event => {
        event.preventDefault();

        if(this.state.edit){
            this.setState({
                showUpdateSuccess: true
            })
        }

        const newTask = this.state.currentTask;
        if (newTask.value !== "") {
            const tasks = [...this.state.allTasks.filter(task => task.key !== this.state.editTaskKey), newTask];
            this.setState({
                allTasks: tasks,
                currentTask: {
                    value: '',
                    date: Date.now(),
                    time: Date.now(),
                    key: '',
                    completed: false
                },
                edit: false,
                editTaskKey: ''
            });
        }else{
            this.setState({
                showError: true,
                showUpdateSuccess: false
            });
        }
    };

    handleKeyPress = (target) => {
        if (target.charCode === 13) {
            this.btn.current.click();
        }
    };

    setShowErrorFalse = () => {
        this.setState({
            showError: false
        });
    };

    setShowUpdateFalse = () => {
        this.setState({
            showUpdateSuccess: false
        });
    };

    showErrorMessage = () => {
        if(this.state.showError){
            return (
                <Alert key='alert' variant='danger' onClose={() => this.setShowErrorFalse()} dismissible>
                    Please enter a task name
                </Alert>
            );
        }
    };

    showSuccessUpdatedMessage = () => {
        if(this.state.showUpdateSuccess && !this.state.showError){
            return (
                <Alert key='alert' variant='success' onClose={() => this.setShowUpdateFalse()} dismissible>
                    Task updated sucessfully!
                </Alert>
            );
        }
    };


    deleteTaskFromListById = key => {
        const filteredTasks = this.state.allTasks.filter(task => task.key !== key);
        this.setState({
            allTasks: filteredTasks
        });
    };

    setCompleted = key => {
        const index = this.state.allTasks.findIndex((task) => {
            return task.key === key;
        });

        const task = Object.assign({}, this.state.allTasks[index]);
        task.completed = !task.completed;

        const allTasks = Object.assign([], this.state.allTasks);
        allTasks[index] = task;

        this.setState({
            allTasks: allTasks
        });

    };

    handleClose = () => {
        this.setState({
            openSnackBar: false
        })
    };

    editTaskById = key => {
        const index = this.state.allTasks.findIndex((task) => {
            return task.key === key;
        });

        const task = Object.assign({}, this.state.allTasks[index]);

        this.setState({
            currentTask: {
                value: task.value,
                date: task.date,
                time: task.time,
                key: task.key,
                completed: task.completed
            },
            edit: true,
            editTaskKey: task.key,
            openSnackBar: true
        });

    };

    render() {
        return (
            <Container>
                <Row>
                    <Col xs={6}>
                        <InputGroup className="mb-3 mt-4">
                            <FormControl
                                placeholder="Task name"
                                aria-label="Task name"
                                aria-describedby="task-name"
                                value={this.state.currentTask.value}
                                onChange={this.onInputChangeHandler}
                                onKeyPress={this.handleKeyPress}
                                required
                            />
                            <InputGroup.Append>
                                <Button ref={this.btn} variant="outline-secondary" id="submitBtn"
                                        onClick={this.handleSubmit}>Add Task</Button>
                            </InputGroup.Append>
                        </InputGroup>
                        {this.showErrorMessage()}
                        {this.showSuccessUpdatedMessage()}
                    </Col>
                    <Col>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                                margin="normal"
                                id="date-picker-dialog"
                                label="Task on"
                                format="MM/dd/yyyy"
                                value={this.state.currentTask.date}
                                onChange={this.handleDateChange}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                            />
                        </MuiPickersUtilsProvider>
                    </Col>
                    <Col>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardTimePicker
                                margin="normal"
                                id="time-picker"
                                label="Task at"
                                value={this.state.currentTask.time}
                                onChange={this.handleTimeChange}
                                KeyboardButtonProps={{
                                    'aria-label': 'change time',
                                }}
                            />
                        </MuiPickersUtilsProvider>
                    </Col>
                </Row>
                <br/>
                <Row>
                    <Col>
                        <TodoList reference={this.todo} show="todos" tasks={this.state.allTasks}
                                  editTaskById={this.editTaskById} setTaskCompleted={this.setCompleted}
                                  removeTaskById={this.deleteTaskFromListById}/>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <TodoList reference={this.todo} show="completed" tasks={this.state.allTasks}
                                  editTaskById={this.editTaskById} setTaskCompleted={this.setCompleted}
                                  removeTaskById={this.deleteTaskFromListById}/>
                    </Col>
                </Row>
                <Snackbar
                    open={this.state.openSnackBar}
                    TransitionComponent={this.state.Transition}
                    onClose={this.handleClose}
                    message="Update the Task now!"
                />
            </Container>
        );
    }
}

export default TodoMain;