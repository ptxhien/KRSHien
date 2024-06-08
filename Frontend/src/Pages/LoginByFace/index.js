import React, {Fragment, useRef, useEffect} from "react";

import bg1 from "../../assets/utils/images/originals/city.jpg";

import {Button, Col, Row} from "reactstrap";
import {useHistory} from "react-router-dom";

export default function LoginByFace() {
  const video = useRef(null);
  const history = useHistory();

  const getVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: {} })
      .then(stream => {
        video.current.srcObject = stream;
        video.current.play();
      })
      .catch(err => {
        console.error("Error:", err);
      });
  }

  useEffect(() => {
    getVideo();
  }, []);

  return (
    <Fragment>
      <div className="h-100">
        <Row className="h-100 no-gutters">
          <Col lg="4" className="d-none d-lg-block">
            <div className="slider-light">
              <div className="h-100 d-flex justify-content-center align-items-center bg-plum-plate">
                <div
                    className="slide-img-bg"
                    style={{
                      backgroundImage: "url(" + bg1 + ")",
                    }}
                />
                <div className="slider-content">
                  <h3>Login By Face</h3>
                  <p>
                    More fast, secure and convenient
                  </p>
                </div>
              </div>
            </div>
          </Col>
          <Col
            className="bg-white"
          >
            <div className="d-flex justify-content-center align-items-center">

              <video ref={video} autoPlay className="ma-auto"
                     onPlay="onVideoLive">
              </video>
            </div>
            <div className="d-flex justify-content-between w-50 m-auto">
              {/* <Button
                  color="success"
                  className="mr-2 mt-4 "
                  size="lg"
                  onClick={() => history.push("/login-by-face")}
              >
                Login by face
              </Button> */}
              <Button
                  className="mr-2 mt-4 "
                  color="primary"
                  onClick={() => history.push("/login")}
                  size="lg"
              >
                Login by username
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    </Fragment>
  );
}
