import React, { Fragment } from "react";
import ThemeOptions from "../../Layout/ThemeOptions";
import AppHeader from "../../Layout/AppHeader";
import "../Home/style.css";
import {Button, Col, Input, Row} from "reactstrap";
import Messages from "../../Layout/Messages";
import {AiOutlineSearch} from "react-icons/all";
import RecruitmentFilter from "../../Components/Recruitment/filters";
import ListRecruit from "../../Components/Recruitment/ListRecruit";
const items = [
    {
        id: 1,
        src: "images/sliders/iuh.jpg"
    },
    {
        id: 2,
        src: "images/sliders/iuh2.jpg"
    },
    {
        id: 3,
        src: "images/sliders/iuh3.jpg"
    },
    {
        id: 4,
        src: "images/sliders/iuh4.jpg"
    },
    {
        id: 5,
        src: "images/sliders/iuh5.jpg"
    },
    {
        id: 6,
        src: "images/sliders/iuh6.jpg"
    },
    {
        id: 7,
        src: "images/sliders/iuh7.jpg"
    }
];

export default function HomePage() {
    return (
        <Fragment>
            <ThemeOptions />
            <Messages />
            <AppHeader className="app-header"/>
            <div className="app-main__inner" style={{paddingTop: '45px'}}>
                <Fragment>
                    <Row className="m-auto">
                        <Col md={12} className="m-auto mt-[40px] p-0">
                            <div style={{height: '220px'}} className="position-relative">
                                <img src="images/sliders/bg.jpg" alt="background" width="100%" height="100%" className="position-absolute"/>
                                <div className="w-75 mx-auto position-relative pl-4 pt-4">
                                    <h3 className="font-weight-bold">
                                        <span className="text-black">Tìm kiếm</span>
                                        <span className="text-white bg-primary ml-2 p1">Best Choice!</span>
                                    </h3>
                                </div>
                                <div className="d-flex position-relative w-75 p-4 bg-white mx-auto">
                                    <Input type="text" placeholder="Tìm kiếm công việc theo tên, vị trí,..." className="search-bar w-100"/>
                                    <Button color="primary" style={{width: '120px'}}>
                                        <AiOutlineSearch style={{fontSize: '16px'}}/>
                                        <span>Tìm kiếm</span>
                                    </Button>
                                    <Button color="primary" style={{width: '110px', marginLeft: '5px'}}>
                                        <span>Recommend</span>
                                    </Button>
                                </div>
                                <div className="w-75 mx-auto mt-3">
                                    <RecruitmentFilter />
                                </div>
                            </div>
                        </Col>
                        <Col md={11} className="m-auto">
                            <div className="app-main__outer">
                                <div className="app-main__inner mt-2">
                                    <ListRecruit />
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Fragment>
            </div>
        </Fragment>
    );
}
//
