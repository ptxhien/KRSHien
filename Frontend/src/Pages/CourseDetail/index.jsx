import React, { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import ThemeOptions from "../../Layout/ThemeOptions";
import Messages from "../../Layout/Messages";
import AppHeader from "../../Layout/AppHeader";
import "./style.scss";
import {Button, ButtonGroup, Row, Col, Form, FormGroup, Input} from "reactstrap";
import avatar1 from "../../assets/utils/images/avatars/2.jpg";

import { useHistory, useParams, useLocation } from "react-router";
import http from "../../redux/utils/http";
import { useMemo } from "react";
import { toastErrorText, toastSuccessText } from "../../helpers/toastify";
import {
  AiFillHome,
  AiOutlineLink,
  AiOutlineShareAlt,
  AiOutlineGlobal,
  AiOutlineClockCircle,
  AiFillStar,
  AiOutlineTeam,
  AiFillDollarCircle,
  AiFillDashboard,
  AiFillSignal
} from "react-icons/ai";
import { useCart } from "../../hooks/useCart";
import RandomImg from "../../Components/Courses/RandomImg";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGlobe, faLink, faStar, faStarHalf, faStarHalfAlt, faUsers} from "@fortawesome/free-solid-svg-icons";
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const CourseDetail = () => {
  const query = useQuery()
  const skillsAcquiredArray = useMemo(() => {
    let data = query.get("skillsAcquired") || ""
    return data.split(", ")
  }, [query])

  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(false);
  const { addCourse } = useCart();

  const getData = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await http.get(`/courses/${id}`)
      setCourse(data);
    } catch (err) {

    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    getData();
  }, [getData]);

  const enroll = useCallback(async (e) => {
    e.target.disabled = true;
    await http.post("/invoices", {
      CourseID: course.courseID,
      Quality: 1,
      ItemPrice: course.feeVND,
    }).then((result, a) => {
      localStorage.setItem("time_enroll", Date.now());
      history.push("/dashboard");
    }).catch((err) => {
      if (err.msg) {
        toastErrorText(err.msg);
      }
    });
  }, [course]);

  function urlshare() {
    return 'https://www.facebook.com/sharer/sharer.php?u=' + window.location;
  }
  return (
    <>
      <ThemeOptions />
      <Messages />
      <AppHeader />

      <div className="app-main__inner">
        {!course && !loading && <section id="wrapper" className="error-page my-5">
          <div className="error-box">
            <div className="error-body text-center">
              <h1>404</h1>
              <h3 className="text-uppercase">Course not found !</h3>
              <p className="text-muted m-t-30 m-b-30">Your course is currently unavailable</p>
              <a href="/" className="btn btn-info btn-rounded waves-effect waves-light m-b-40">Back to home</a> </div>
          </div>
        </section>}

        {course && <div className="container-fluid py-5">
          <div className="container py-4">
            <div className="row">
              <div className="col-lg-8">
                <div className="mb-5">
                  <h2 className="mb-3">
                    <span style={{color: '#B80000'}}><b>({course.majobSubject}) </b></span>
                    - <b>{course.courseTitle}</b>
                  </h2>
                  <div className="banner">
                    <div className="h-25">
                      <RandomImg pageProps={id} />
                    </div>
                    <ButtonGroup className="enroll-btn-group">
                      <Button
                        className="btn-wide btn-icon"
                        color="success"
                        onClick={() => addCourse(course)}
                      >
                        <i className="pe-7s-news-paper btn-icon-wrapper"></i>
                        Add to Cart
                      </Button>
                    </ButtonGroup>
                  </div>

                  <div className="d-flex mt-5 mb-4 align-items-center">
                    <img src="images/courses/what.png" className="img-fluid rounded-circle mr-2" style={{width: '45px', height: '45px'}} />
                    <span style={{fontWeight: 'bold', color: '#B80000', fontSize: '20px'}}>WHAT YOU WILL LEARN ?</span>
                  </div>

                  <p>{course.outcomeLearning}</p>
                </div>

                <div className="mb-5">
                  <h5 className="text-uppercase mb-4 font-weight-bold">Comment (1)</h5>
                  <Form>
                    <FormGroup className="d-flex">
                      <img src="images/courses/avatar.jpeg" alt="Image" className="img-fluid rounded-circle mr-3 mt-1"
                           style={{width: '45px', height: '45px'}}/>
                      <Input
                          id="exampleText"
                          name="text"
                          type="textarea"
                          placeholder="Write your comment..."
                      />
                    </FormGroup>
                    <div style={{textAlign: 'end'}}>
                        <span className="btn btn-primary">Send</span>
                    </div>
                  </Form>
                  <div className="media mb-4">
                    <img src={avatar1} alt="Image" className="img-fluid rounded-circle mr-3 mt-1" style={{ width: '45px' }} />
                    <div className="media-body">
                      <h6>Phạm Thị Xuân Hiền <small><i>01 Jan 2022 at 12:00pm</i></small></h6>
                      <p>Good course</p>
                      <button className="btn btn-sm btn-secondary">Reply</button>
                    </div>
                  </div>
                </div>

              </div>
              <div className="col-lg-4 mt-5 mt-lg-0 pl-4">

                <div className="d-flex">
                  <img src="images/courses/course.png" className="img-fluid rounded-circle mr-1" style={{width: '50px', height: '50px'}} />
                  <div>
                    <h5 className="mb-0 font-weight-bold"> {course.provider}</h5>
                    {course.hasOwnProperty('location') ?
                      <span style={{fontSize: '10px', fontWeight: 'bold'}}>OFFLINE COURSE</span>
                        :
                      <span style={{fontSize: '10px', fontWeight: 'bold'}}>ONLINE COURSE</span>
                    }
                  </div>
                </div>

                <div className="mt-4 mb-3">
                  <h5 className="pt-2" >
                    <div style={{color: '#0062B1'}}><b>INFORMATION COURSE</b>&nbsp;</div>
                  </h5>
                  <div className="d-flex flex-column rounded mb-5" style={{fontSize: '16px'}}>
                    <div className="d-flex">
                      <div className="d-flex flex-column" style={{gap: '5px'}}>
                        <div>
                          <AiFillSignal className="mr-2" />{course.level}
                        </div>
                        <div>
                          {course.numStudent && <div>
                            <FontAwesomeIcon icon={faUsers} className="mr-1" /> {course.numStudent}</div>}
                        </div>
                        <div>
                          <AiFillDollarCircle className="mr-2" />{course.feeVND == 0 ? "Free" : new Intl.NumberFormat('it-IT').format(course.feeVND) + " VNĐ"}
                        </div>
                        <div>
                          {course.rating && (
                              <>
                                {course.rating > 4.5 ? (
                                    <FontAwesomeIcon className="mr-2" icon={faStar} />
                                ) : (
                                    <FontAwesomeIcon className="mr-2" icon={faStarHalfAlt} />
                                )}
                                {course.rating.toFixed(1)}
                              </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="d-flex flex-column mt-2" style={{gap: '5px'}}>
                      <div className="d-flex">
                        <FontAwesomeIcon icon={faGlobe} className="mr-2 mt-1"/>
                        <div>{course.language}</div>
                      </div>
                      {course.studyTime &&
                          <div><AiOutlineClockCircle className="mr-2"/> {course.studyTime}<br/></div>}
                      {course.location && <div><AiFillHome className="mr-2"/> {course.location}</div>}
                      <div className="d-flex">
                        <FontAwesomeIcon icon={faLink} className="mr-2"/>
                        <a href={course.URL} target="_blank">Link: {course.URL}</a>
                      </div>
                      <a href={urlshare()}
                         target="_blank"
                         className="btn btn-outline-primary">
                        <AiOutlineShareAlt className="mr-2"/>
                        Share
                      </a>
                    </div>
                  </div>
                </div>

                {/* Tag Cloud */}
                <div className="mb-5">

                  <h4>
                    <div style={{color: '#0062B1'}}><b>SKILLS COURSES</b><br/></div>
                  </h4>
                  <div className="d-flex flex-wrap m-n1">
                    {course.technologySkill.split(", ").map((skill, index) => (
                        <a href="" onClick={(e) => {
                          e.preventDefault();
                          console.log(Object.keys(skillsAcquiredArray))
                        }}
                           className={`btn ${skillsAcquiredArray.includes(skill) ? "active-btn" : "btn-outline-primary"} m-1`}
                           key={index}>{skill}</a>
                    ))}

                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>}
      </div>
    </>
  );
}

export default CourseDetail
