// import React, { Fragment, Component, useState, useLayoutEffect } from "react";

// import Slider from "react-slick";

// import bg1 from "../../assets/utils/images/originals/city.jpg";
// import bg2 from "../../assets/utils/images/originals/citydark.jpg";
// import bg3 from "../../assets/utils/images/originals/citynights.jpg";

// import { Col, Row, Button, Form, FormGroup, Label, Input } from "reactstrap";
// import { useDispatch, useSelector } from "react-redux";
// import { actionLoginRequest } from "../../redux/actions/account/accountAction";
// import { toastErrorText, toastSuccessText } from "../../helpers/toastify";
// import {useHistory, Link} from 'react-router-dom';

// export default function Login() {
//   const history = useHistory();
//   let settings = {
//     dots: true,
//     infinite: true,
//     speed: 500,
//     arrows: true,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     fade: true,
//     initialSlide: 0,
//     autoplay: true,
//     adaptiveHeight: true,
//   };
//   const dispatch = useDispatch();
//   const accountReducer = useSelector(state => state.accountReducer)
//   const [loginData, setloginData] = useState({
//     email: "",
//     password: "",
//   });

//   useLayoutEffect(() => {
//     const {isLogged, error, authToken} = accountReducer;
//     if (isLogged && authToken) {
//       toastSuccessText("Login success!");
//       history.push("/");
//     } else if (error) {
//       console.log(error);
//       toastErrorText(error);
//     }
//   }, [accountReducer]);

//   function onClickLogin() {
//     if (loginData.email && loginData.password) {
//       dispatch(actionLoginRequest(loginData));

//     } else {
//       toastErrorText("Please input Email and Password!");
//     }
//   }

//   return (
//     <Fragment>
//       <div className="h-100">
//         <Row className="h-100 no-gutters">
//           <Col lg="4" className="d-none d-lg-block">
//             <div className="slider-light">
//               <Slider {...settings}>
//                 <div className="h-100 d-flex justify-content-center align-items-center bg-plum-plate">
//                   <div
//                     className="slide-img-bg"
//                     style={{
//                       backgroundImage: "url(" + bg1 + ")",
//                     }}
//                   />
//                   <div className="slider-content">
//                     {/* <h3>Perfect Balance</h3>
//                     <p>
//                       ArchitectUI is like a dream.
//                     </p> */}
//                   </div>
//                 </div>
//                 <div className="h-100 d-flex justify-content-center align-items-center bg-premium-dark">
//                   <div
//                     className="slide-img-bg"
//                     style={{
//                       backgroundImage: "url(" + bg3 + ")",
//                     }}
//                   />
//                   <div className="slider-content">
//                     {/* <h3>Scalable, Modular, Consistent</h3> */}
//                     {/* <p>
//                       Easily exclude the components you don't require.
//                       Lightweight, consistent Bootstrap based styles across all
//                       elements and components
//                     </p> */}
//                   </div>
//                 </div>
//                 <div className="h-100 d-flex justify-content-center align-items-center bg-sunny-morning">
//                   <div
//                     className="slide-img-bg opacity-6"
//                     style={{
//                       backgroundImage: "url(" + bg2 + ")",
//                     }}
//                   />
//                   <div className="slider-content">
//                     {/* <h3>Complex, but lightweight</h3>
//                     <p>
//                       We've included a lot of components that cover almost all
//                       use cases for any type of application.
//                     </p> */}
//                   </div>
//                 </div>
//               </Slider>
//             </div>
//           </Col>
//           <Col
//             lg="8"
//             md="12"
//             className="h-100 d-flex bg-white justify-content-center align-items-center"
//           >
//             <Col lg="9" md="10" sm="12" className="mx-auto app-login-box">
//               <div className="app-logo" />
//               <h4 className="mb-0">
//                 <div>Welcome back,</div>
//                 <span>Please sign in to your account.</span>
//               </h4>
//               <h6 className="mt-3">
//                 No account?
//                 <Link to="/register" className="text-primary">
//                   Sign up now
//                 </Link>
//               </h6>
//               <Row className="divider" />
//               <div>
//                 <Form onSubmit={onClickLogin}>
//                   <Row form>
//                     <Col md={6}>
//                       <FormGroup>
//                         <Label for="exampleEmail">Email</Label>
//                         <Input
//                           type="email"
//                           name="email"
//                           id="exampleEmail"
//                           placeholder="Email here..."
//                           onKeyDown={(e) => {
//                             if (e.key === "Enter") {
//                               onClickLogin();
//                             }
//                           }}
//                           onChange={(e) =>
//                             setloginData({
//                               ...loginData,
//                               email: e.target.value,
//                             })
//                           }
//                         />
//                       </FormGroup>
//                     </Col>
//                     <Col md={6}>
//                       <FormGroup>
//                         <Label for="examplePassword">Password</Label>
//                         <Input
//                           type="password"
//                           name="password"
//                           id="examplePassword"
//                           placeholder="Password here..."
//                           onKeyDown={(e) => {
//                             if (e.key === "Enter") {
//                               onClickLogin();
//                             }
//                           }}
//                           onChange={(e) =>
//                             setloginData({
//                               ...loginData,
//                               password: e.target.value,
//                             })
//                           }
//                         />
//                       </FormGroup>
//                     </Col>
//                   </Row>
//                   <Row className="divider" />
//                   <div className="d-flex align-items-center">
//                     <div className="ml-auto">
//                       {/* <Button
//                           color="success"
//                           className="mr-2"
//                           size="lg"
//                           disabled={accountReducer.isLoading}
//                           onClick={() => history.push("/login-by-face")}
//                       >
//                         Login by face
//                       </Button> */}
//                       <Button
//                         color="primary"
//                         size="lg"
//                         onClick={() => onClickLogin()}
//                         disabled={accountReducer.isLoading}
//                       >
//                         {accountReducer.isLoading ? "Loading ..." : "Login to Dashboard"}
//                       </Button>
//                     </div>
//                   </div>
//                 </Form>
//               </div>
//             </Col>
//           </Col>
//         </Row>
//       </div>
//     </Fragment>
//   );
// }
import React, { Fragment, useState, useLayoutEffect } from "react";
import Slider from "react-slick";
import bg1 from "../../assets/utils/images/originals/city.jpg";
import bg2 from "../../assets/utils/images/originals/citydark.jpg";
import bg3 from "../../assets/utils/images/originals/citynights.jpg";
import { Col, Row, Button, Form, FormGroup, Label, Input, InputGroup, InputGroupText } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { actionLoginRequest } from "../../redux/actions/account/accountAction";
import { toastErrorText, toastSuccessText } from "../../helpers/toastify";
import { useHistory, Link } from 'react-router-dom';
import "@fortawesome/fontawesome-free/css/all.min.css"; // Import Font Awesome CSS

export default function Login() {
  const history = useHistory();
  let settings = {
    dots: true,
    infinite: true,
    speed: 500,
    arrows: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    initialSlide: 0,
    autoplay: true,
    adaptiveHeight: true,
  };
  const dispatch = useDispatch();
  const accountReducer = useSelector(state => state.accountReducer);
  const [loginData, setloginData] = useState({
    email: "",
    password: "",
  });

  useLayoutEffect(() => {
    const { isLogged, error, authToken } = accountReducer;
    if (isLogged && authToken) {
      toastSuccessText("Login success!");
      history.push("/");
    } else if (error) {
      console.log(error);
      toastErrorText(error);
    }
  }, [accountReducer, history]);

  function onClickLogin() {
    if (loginData.email && loginData.password) {
      dispatch(actionLoginRequest(loginData));
    } else {
      toastErrorText("Please input Email and Password!");
    }
  }

  return (
    <Fragment>
      <div className="h-100">
        <Row className="h-100 no-gutters">
          <Col lg="4" className="d-none d-lg-block">
            <div className="slider-light">
              <Slider {...settings}>
                <div className="h-100 d-flex justify-content-center align-items-center bg-plum-plate">
                  <div
                    className="slide-img-bg"
                    style={{ backgroundImage: `url(${bg1})` }}
                  />
                  <div className="slider-content">
                    {/* <h3>Perfect Balance</h3>
                    <p>
                      Courses Divahieen offers a perfect balance of theoretical and practical knowledge.
                    </p> */}
                  </div>
                </div>
                <div className="h-100 d-flex justify-content-center align-items-center bg-premium-dark">
                  <div
                    className="slide-img-bg"
                    style={{ backgroundImage: `url(${bg3})` }}
                  />
                  <div className="slider-content">
                    {/* <h3>Scalable, Modular, Consistent</h3>
                    <p>
                      Courses Divahieen provides scalable, modular, and consistent learning modules for all levels.
                    </p> */}
                  </div>
                </div>
                <div className="h-100 d-flex justify-content-center align-items-center bg-sunny-morning">
                  <div
                    className="slide-img-bg opacity-6"
                    style={{ backgroundImage: `url(${bg2})` }}
                  />
                  <div className="slider-content">
                    {/* <h3>Complex, but Lightweight</h3>
                    <p>
                      Courses Divahieen covers a wide range of topics, yet remains lightweight and easy to understand.
                    </p> */}
                  </div>
                </div>
              </Slider>
            </div>
          </Col>
          <Col
            lg="8"
            md="12"
            className="h-100 d-flex bg-white justify-content-center align-items-center"
          >
            <Col lg="9" md="10" sm="12" className="mx-auto app-login-box">
              <div className="app-logo" />
              <h4 className="mb-0">
                <div>Welcome back,</div>
                <span>Please sign in to your account.</span>
              </h4>
              <h6 className="mt-3">
                No account?
                <Link to="/register" className="text-primary">
                  Sign up now
                </Link>
              </h6>
              <Row className="divider" />
              <div>
                <Form onSubmit={onClickLogin}>
                  <Row form>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="exampleEmail">Email</Label>
                        <InputGroup>
                          <InputGroupText>
                            <i className="fas fa-envelope" />
                          </InputGroupText>
                          <Input
                            type="email"
                            name="email"
                            id="exampleEmail"
                            placeholder="Email here..."
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                onClickLogin();
                              }
                            }}
                            onChange={(e) =>
                              setloginData({
                                ...loginData,
                                email: e.target.value,
                              })
                            }
                          />
                        </InputGroup>
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="examplePassword">Password</Label>
                        <InputGroup>
                          <InputGroupText>
                            <i className="fas fa-lock" />
                          </InputGroupText>
                          <Input
                            type="password"
                            name="password"
                            id="examplePassword"
                            placeholder="Password here..."
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                onClickLogin();
                              }
                            }}
                            onChange={(e) =>
                              setloginData({
                                ...loginData,
                                password: e.target.value,
                              })
                            }
                          />
                        </InputGroup>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row className="divider" />
                  <div className="d-flex align-items-center">
                    <div className="ml-auto">
                      <Button
                        color="primary"
                        size="lg"
                        onClick={() => onClickLogin()}
                        disabled={accountReducer.isLoading}
                      >
                        {accountReducer.isLoading ? "Loading ..." : "Login to Dashboard"}
                      </Button>
                    </div>
                  </div>
                </Form>
              </div>
            </Col>
          </Col>
        </Row>
      </div>
    </Fragment>
  );
}
