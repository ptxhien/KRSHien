import React, { Fragment, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ThemeOptions from "../../Layout/ThemeOptions";
import AppHeader from "../../Layout/AppHeader";
import { GetJobAction } from "../../redux/masterdata/masterDataAction";
import "../Home/style.css";
import {Card, CardBody, Col, Row, UncontrolledCarousel} from "reactstrap";

import {
  getCourses,
  recommendCourses,
} from "../../redux/actions/courses/courses";
import { splitToSubArr } from "../../utils";

import { toastErrorText } from "../../helpers/toastify";
import { useHistory } from "react-router";
import { DefaultCourses } from "../../Components/Courses";
import RecommendationHandler from "../../Components/RecommendationHandler";
import MethodEnum from "../../Components/Courses/MethodEnum";
import RecommendationCourses from "../../Components/Courses/Recommendation";
import Messages from "../../Layout/Messages";
const items = [
  {
    id: 1,
    src: "images/sliders/hcmus.jpeg"
  }
  // },
  // {
  //   id: 2,
  //   src: "images/sliders/hcmus1.jpeg"
  // }
  // {
  //   id: 3,
  //   src: "images/sliders/hcmus2.png"
  // },
  // {
  //   id: 4,
  //   src: "images/sliders/hcmus3.png"
  // },
  // {
  //   id: 5,
  //   src: "images/sliders/hcmus.png"
  // }
];

const CarouselDefault = () => (
  <UncontrolledCarousel items={items} />
);
/*  */
export default function HomePage() {
  const dispatch = useDispatch();
  const { coursesReducer } = useSelector((state) => state);

  const [courseArrays, setCourseArrays] = useState([]);
  const [courseOnlineArrays, setCourseOnlineArrays] = useState([]);
  const [courseOfflineArrays, setCourseOfflineArrays] = useState([]);

  const [exception, setException] = useState([]);
  const [bothException, setBothException] = useState([]);
  const [bothStatus, setBothStatus] = useState(0);
  const [bothMessage, setBothMessage] = useState("");
  const [bothNgoaiLe, setBothNgoaiLe] = useState({});

  const history = useHistory();
  const itemsCountPerPage = 8;
  const [activePage, setActivePage] = useState(1);
  const [totalItemsCount, setTotalItemsCount] = useState(1);
  const [method, setMethod] = useState(MethodEnum.ONLINE);

  useEffect(() => {
    dispatch(GetJobAction());
    dispatch(getCourses());
  }, []);

  useEffect(() => {
    if (localStorage.getItem("Form") === "online") {
      setMethod(MethodEnum.ONLINE);
    } else if (localStorage.getItem("Form") === "offline") {
      setMethod(MethodEnum.OFFLINE);
    }

    localStorage.removeItem("Form");

    if (!coursesReducer.isRecommended) {
      setTotalItemsCount(coursesReducer.data.length);
      setCourseArrays(splitToSubArr(coursesReducer.data, itemsCountPerPage));
    } else {
      if (method === MethodEnum.ONLINE) {
        const onlineCourses = coursesReducer.online.Course && coursesReducer.online.Course.length
          ? coursesReducer.online.Course
          : coursesReducer.online.Ngoai_Le && coursesReducer.online.Ngoai_Le.Course_Offer &&
            coursesReducer.online.Ngoai_Le.Course_Offer.length
          ? coursesReducer.online.Ngoai_Le.Course_Offer
          : [];
        setTotalItemsCount(onlineCourses.length);
        setCourseArrays(splitToSubArr(onlineCourses, itemsCountPerPage));
        setException(coursesReducer.online && coursesReducer.online.Exception || {});
        setBothException(coursesReducer.online && coursesReducer.online.Exception || []);
        setBothStatus(coursesReducer.online && coursesReducer.online.status || 0);
        setBothMessage(coursesReducer.online && coursesReducer.online.message || "");
        setCourseOnlineArrays(onlineCourses || []);
        setBothNgoaiLe(coursesReducer.online && coursesReducer.online.Ngoai_Le || {});
      } else if (method === MethodEnum.OFFLINE) {
        const offlineCourses = coursesReducer.offline.Course && coursesReducer.offline.Course.length
          ? coursesReducer.offline.Course
          : coursesReducer.offline.Ngoai_Le && coursesReducer.offline.Ngoai_Le.Course_Offer &&
            coursesReducer.offline.Ngoai_Le.Course_Offer.length
          ? coursesReducer.offline.Ngoai_Le.Course_Offer
          : [];
        setTotalItemsCount(offlineCourses.length);
        setCourseArrays(splitToSubArr(offlineCourses, itemsCountPerPage));
        setException(coursesReducer.offline && coursesReducer.offline.Exception || {});
        setBothException(coursesReducer.offline && coursesReducer.offline.Exception || []);
        setBothStatus(coursesReducer.offline && coursesReducer.offline.status || 0);
        setBothMessage(coursesReducer.offline && coursesReducer.offline.message || "");
        setCourseOfflineArrays(offlineCourses || []);
        setBothNgoaiLe(coursesReducer.offline && coursesReducer.offline.Ngoai_Le || {});
      }
    }
  }, [coursesReducer, method]);

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  return (
    <Fragment>
      <ThemeOptions />
      <Messages />
      <AppHeader className="app-header"/>
      <div className="app-main__inner" style={{paddingTop: '50px'}}>
        <Fragment>
          <Row className="m-auto">
            <Col md={11} className="m-auto py-2 mt-[60px]">
              <Card>
                <CarouselDefault />
              </Card>
            </Col>
            <Col md={11} className="m-auto">
              <RecommendationHandler />
            </Col>
            <Col md={11} className="m-auto">
              <div className="app-main__outer">
                <div className="app-main__inner mt-2">
                  {coursesReducer.isLoading ? (
                      <div className="m-auto" style={{width: 100, height: 50}}>
                        <img src="/images/loading.gif" style={{width: 650, height: 300}}></img>
                      </div>
                  ) : coursesReducer.isRecommended ? (
                      <RecommendationCourses
                          activePage={activePage}
                          courseArrays={courseArrays}
                          courseOnlineArrays={courseOnlineArrays}
                          courseOfflineArrays={courseOfflineArrays}
                          exceptions={exception}
                          bothException={bothException}
                          bothMessage={bothMessage}
                          bothStatus={bothStatus}
                          handlePageChange={handlePageChange}
                          itemsCountPerPage={itemsCountPerPage}
                          totalItemsCount={totalItemsCount}
                          setMethod={setMethod}
                          method={method}
                          bothNgoaiLe={bothNgoaiLe}
                      />
                  ) : (
                      <DefaultCourses
                          activePage={activePage}
                          courseArrays={courseArrays}
                          handlePageChange={handlePageChange}
                          itemsCountPerPage={itemsCountPerPage}
                          totalItemsCount={totalItemsCount}
                      />
                  )}
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
