import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleUp, faHeart } from "@fortawesome/free-solid-svg-icons";
import {
  Col,
  Row,
  Button,
  Card,
  CardBody,
  CardTitle,
  CardSubtitle, Badge,
} from "reactstrap";
import Rating from "react-rating";
import image1 from "../../assets/images/slider-img2.jpg";
import Pagination from "react-js-pagination";
import { Link } from "react-router-dom";
import Chip from "../Commons/Chip";
import RandomImg from "./RandomImg";


function DefaultCourses({ courseArrays, activePage, itemsCountPerPage, handlePageChange, totalItemsCount}) {
  return (
    <div>
      <Card>
        <CardBody>
          <Row>
            {courseArrays[activePage - 1] &&
                courseArrays[activePage - 1].map((item, index) => {
                  return (
                      <Col md="6" lg="4" xl="3" key={index} className="mb-3">
                        <Card
                            data-tip
                            data-for={item.courseTitle}
                            body
                            className="card-shadow-primary border p-0"
                            outline
                            color="primary"
                            style={{borderRadius: 12, height: "100%"}}
                        >
                          <CardBody title={item.courseTitle}>
                            <Link
                                target="_blank"
                                to={`course/${item.courseID}`}
                                className="text-decoration-none course-card"
                            >
                              <div className="overflow-hidden d-flex justify-content-center mb-1"
                                   style={{height: '150px'}}>
                                <RandomImg pageProps={activePage}/>
                              </div>

                              <CardTitle
                                  title={item.courseTitle}
                              >
                                {item.courseTitle}
                              </CardTitle>
                            </Link>
                            <CardSubtitle className="mb-0">
                              {item.provider}
                            </CardSubtitle>
                            <span className="mr-1 text-success">
                            {item.rating ? item.rating.toFixed(1) : 0}/5
                          </span>
                            <Rating
                                stop={5}
                                initialRating={item.rating}
                                emptySymbol={
                                  <span className="mr-1 opacity-2">
                                <FontAwesomeIcon
                                    size="1x"
                                    icon={faHeart}
                                    color="red"
                                />
                              </span>
                                }
                                fullSymbol={
                                  <span className="mr-1">
                                <FontAwesomeIcon
                                    size="1x"
                                    icon={faHeart}
                                    color="red"
                                />
                              </span>
                                }
                            />
                            <span className="text-info">
                            ({item.peopleRating ? item.peopleRating : 0})
                          </span>
                            <div className="d-flex align-items-center">
                              <i className="pe-7s-cash btn-icon-wrapper mr-1"></i>
                              {item.feeVND == 0 ? "Free" : new Intl.NumberFormat('it-IT').format(item.feeVND) + " VNĐ"}
                            </div>
                          </CardBody>
                          <CardBody className="py-0">
                            {item.technologySkill && (<div className="m-1 d-flex flex-wrap">
                              {item.technologySkill.split(", ").map((skill, index) => (
                                  (index < 3) && (
                                      <div>
                                        <Chip color="#1663ba" text={skill} />
                                      </div>
                                  )
                              ))}
                              {
                                  (item.technologySkill.split(",").length > 3) && (
                                      <div>
                                        <Chip color="#1663ba" text={`+${item.technologySkill.split(",").length - 3}`} />
                                      </div>)
                              }
                            </div>)}
                          </CardBody>
                        </Card>
                      </Col>
                  )
                      ;
                })}
          </Row>
        </CardBody>
      </Card>
      <div className="my-pagination mt-2">
        <Pagination
            activePage={activePage}
            itemsCountPerPage={itemsCountPerPage}
            totalItemsCount={totalItemsCount}
            pageRangeDisplayed={5}
            onChange={handlePageChange}
        />
      </div>
    </div>
  );
}

export default DefaultCourses;
