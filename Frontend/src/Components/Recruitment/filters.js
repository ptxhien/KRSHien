import React, { useRef, useEffect } from "react";
import {
  Col,
  Row,
  FormGroup,
  Input,
} from "reactstrap";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import ModalFaded from "../../Pages/Components/Modal/Examples/ModalFaded";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toastErrorText } from "../../helpers/toastify";
import { recommendCourses } from "../../redux/actions/courses/courses";

function RecruitmentFilter() {
  const { masterdataReducer, accountReducer, coursesReducer } = useSelector(
    (state) => state
  );
  const lsPlace = [
    { placeID: 1, placeName: "Hồ Chí Minh" },
    { placeID: 2, placeName: "Hà Nội" },
    { placeID: 3, placeName: "Đà Nẵng" },
    { placeID: 4, placeName: "Cần Thơ" },
    { placeID: 5, placeName: "Hải Phòng" },
    { placeID: 6, placeName: "Bình Dương" },
    { placeID: 7, placeName: "Đồng Nai" },
  ];

  const lsPositions = [
    { id: 1, name: "Developer" },
    { id: 2, name: "Tester" },
    { id: 3, name: "Designer" },
    { id: 4, name: "BA" },
    { id: 5, name: "PM" },
    { id: 6, name: "HR" },
    { id: 7, name: "Accountant" },
  ];

  const lsLevels = [
    { id: 1, name: "Fresher" },
    { id: 2, name: "Intern" },
    { id: 3, name: "Junior" },
    { id: 4, name: "Middle" },
    { id: 5, name: "Senior" },
    { id: 6, name: "Leader" },
    { id: 7, name: "Manager" },
  ];

  const lsSalaries = [
    { id: 1, label: "< 5 triệu" },
    { id: 2, label: "5 - 10 triệu" },
    { id: 3, label: "10 - 15 triệu" },
    { id: 4, label: "15 - 20 triệu" },
    { id: 5, label: "20 - 25 triệu" },
    { id: 6, label: "25 - 30 triệu" },
    { id: 7, label: "30 - 35 triệu" },
    { id: 8, label: "> 35 triệu" },
  ];
  const history = useHistory();
  const dispatch = useDispatch();

  const recommendationInfo = useRef({
    place: null,
    position: null,
    level: null,
    salary: null,
  });

  useEffect(() => {
    const onStorageEvent = ({ key, oldValue, newValue }) => {
      if (key === "time_enroll") {
        if (coursesReducer.isRecommended) {
          submit();
        }
      }
    };
    window.addEventListener("storage", onStorageEvent);
    return () => {
      window.removeEventListener("storage", onStorageEvent);
    };
  }, [coursesReducer]);

  const submit = () => {
    const errs = [];
    const { occupation, form, month, typeFilter } = recommendationInfo.current;
    const { email } = accountReducer.user;
    // validation
    if (!occupation) {
      errs.push("Occupation is required");
    }
    if (!email) {
      history.push("/login");
      return;
    }
    // fire errs message
    if (errs.length) {
      errs.forEach((err) => {
        toastErrorText(err);
      });
    } else {
      // call api to RS server
      localStorage.setItem("Form", form);
      dispatch(recommendCourses(occupation, form, month, email, typeFilter));
    }
  };

  return (
      <Row form>
        <Col sm={11}>
          <Row>
            <Col md={3}>
              <FormGroup className="pb-0">
                <Select
                    components={makeAnimated()}
                    closeMenuOnSelect={true}
                    getOptionLabel={(option) => option.placeName}
                    getOptionValue={(option) => option.placeID}
                    options={lsPlace}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    placeholder="Chọn địa điểm"
                    onChange={(e) => {
                      recommendationInfo.current.place = e.placeID;
                    }}
                />
              </FormGroup>
            </Col>

            <Col md={3}>
              <FormGroup className="pb-0">
                <Select
                    components={makeAnimated()}
                    closeMenuOnSelect={true}
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option.id}
                    options={lsPositions}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    placeholder="Vị trí ứng tuyển"
                    onChange={(e) => {
                      recommendationInfo.current.position = e.id;
                    }}
                />
              </FormGroup>
            </Col>

            <Col md={3}>
              <FormGroup className="pb-0">
                <Select
                    components={makeAnimated()}
                    closeMenuOnSelect={true}
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option.id}
                    options={lsLevels}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    placeholder="Level"
                    onChange={(e) => {
                      recommendationInfo.current.level = e.id;
                    }}
                />
              </FormGroup>
            </Col>

            <Col md={3}>
              <FormGroup className="pb-0">
                <Select
                    components={makeAnimated()}
                    closeMenuOnSelect={true}
                    getOptionLabel={(option) => option.label}
                    getOptionValue={(option) => option.id}
                    options={lsSalaries}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    placeholder="Mức lương"
                    onChange={(e) => {
                      recommendationInfo.current.salary = e.id;
                    }}
                />
              </FormGroup>
            </Col>
          </Row>
        </Col>
        <Col md={1}>
            <span className="btn btn-outline-light bg-white w-100">
              <img src="images/navbars/unfilter.png" width="35px" height="24px"/>
            </span>
        </Col>

      </Row>
  );
}

export default RecruitmentFilter;
