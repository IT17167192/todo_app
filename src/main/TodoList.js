import React from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import FlipMove from 'react-flip-move';
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import DeleteOutlineRoundedIcon from '@material-ui/icons/DeleteOutlineRounded';
import EditTwoToneIcon from '@material-ui/icons/EditTwoTone';
import Tooltip from '@material-ui/core/Tooltip';

export default function TodoList(props) {
    let tasks = props.tasks;
    if(props.show === 'todos'){
        tasks = tasks.filter(task => task.completed === false);
    }else if(props.show === 'completed'){
        tasks = tasks.filter(task => task.completed === true);
    }

    tasks.sort(function(a, b) {
        return b.key - a.key;
    });

    dayjs.extend(relativeTime);

    const list = tasks.map(item => {
        return (
            <Card ref={props.reference+item.key} bg="dark" text='white' key={item.key} className="mb-1">
                <Card.Body>
                    <Container>
                        <Row className="mb-1">
                            <Tooltip placement="left-start"
                                     title={!item.completed ? "Click to complete" : "Click to add as todo"}>
                                <Col className="text-left" onClick={() => props.setTaskCompleted(item.key)} style={{
                                    cursor: "pointer",
                                    textDecoration: item.completed ? 'line-through' : 'none'
                                }}>{item.value}</Col>
                            </Tooltip>
                        </Row>
                        <Row>
                            <Col className="text-left" style={{color: "#2196F3"}}>{dayjs(item.key).fromNow()}</Col>
                            <Col>On {dayjs(item.date).format("dddd, MMMM D YYYY")} at {dayjs(item.time).format("h:mm a")}</Col>
                            <Col className="text-right"><Tooltip title={item.completed ? "": "Edit"} placement="bottom-end"><Button
                                variant="info" style={{cursor: item.completed ? "no-drop" : ""}} disabled={item.completed ? true: false}  onClick={() => props.editTaskById(item.key)}><EditTwoToneIcon/></Button></Tooltip>{' '}<Tooltip
                                title="Delete" placement="bottom-end"><Button
                                onClick={() => props.removeTaskById(item.key)}
                                variant="danger"><DeleteOutlineRoundedIcon/></Button></Tooltip></Col>
                        </Row>
                    </Container>
                </Card.Body>
            </Card>
        );
    });

    return (
        <FlipMove duration={200} easing="ease-in-out">
            {list}
        </FlipMove>
    );
}