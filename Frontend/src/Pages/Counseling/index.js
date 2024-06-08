import React, {
  Fragment
} from "react";
import ThemeOptions from "../../Layout/ThemeOptions";
import Messages from "../../Layout/Messages";
import AppHeader from "../../Layout/AppHeader";
import { useCart } from "../../hooks/useCart";
import { Col, Row, Button } from "reactstrap";

export default function Counseling() {
  const { cart, deleteCourse, selectItem, selectAllItem, enroll } = useCart();
  return (
    <>
      <ThemeOptions />
      <Messages />
      <AppHeader />
      <div className="app-main__inner">
        <div
          style={{
            padding: 100,
          }}
        >
          <h1>
            <div style={{ color: "#000000" }}>
              <b>Counseling</b>
              <br />
            </div>
          </h1>
        </div>
      </div>
    </>
  );
}

