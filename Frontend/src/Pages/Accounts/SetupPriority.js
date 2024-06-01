import React, {Fragment, useCallback, useEffect, useRef, useState, useLayoutEffect} from "react";
import { Rating } from 'react-simple-star-rating'
import ThemeOptions from "../../Layout/ThemeOptions";
import Messages from "../../Layout/Messages";
import AppHeader from "../../Layout/AppHeader";
import {
    FormGroup,
    Label,
    Input,
    Col,
    Form,
    Button,
} from "reactstrap";

export default function SetupPriority() {
    const initPriority = [
        {
            text: "Khoảng cách",
            key: "distance",
            value: 0
        },
        {
            text: "Giá",
            key: "price",
            value: 0
        },
        {
            text: "Thời gian",
            key: "time",
            value: 0
        },
        {
            text: "Chất lượng",
            key: "quality",
            value: 0
        },
        {
            text: "Chủ đề",
            key: "theme",
            value: 0
        }
    ]
    const [priority, setPriority] = useState(initPriority)

    const handleRating = (item) => (rate) => {
        const newPriority = priority.map(p => {
            if (p.key === item.key) {
                return {
                    ...p,
                    value: rate
                }
            }
            return p
        })
        setPriority(newPriority)
    }

    return (
        <>
            <ThemeOptions/>
            <Messages/>
            <AppHeader/>
            <div className="mb-5"/>
            <div className="app-main__inner card-body main-card card container my-5">
                <div className="form-wizard-content">
                    <Form>
                        <FormGroup row>
                            <Label for="exampleEmail" sm={4}>
                                What do you do?
                            </Label>
                            <Col sm={7}>
                                {priority.map((item, index) => (
                                    <div>
                                        <span>{item.text}</span>
                                        <Rating onClick={handleRating(item)} initialValue={item.value}/>
                                    </div>
                                ))}
                                <br/>
                            </Col>
                            <div>
                                {priority.map((item, index) => (
                                    <div>
                                        <span>{item.text}</span>
                                        <span>{item.key}</span>
                                        <span>{item.value}</span>
                                    </div>

                                ))}
                            </div>
                        </FormGroup>
                    </Form>

                    <div className="text-center">
                        <Button color="success" size="lg" className="btn-shadow btn-wide">
                            Update
                        </Button>
                    </div>
                    <br/>
                </div>
            </div>
        </>
    );
}
