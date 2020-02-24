import React, { Component } from "react";
import styles from "./Layout.module.css";
import Aux from "../Auxiliary/Auxiliary";
import SideAndTopNavBar from "../../components/Navigation/SideAndTopNavBar/SideAndTopNavBar";

class Layout extends Component {
  render() {
    return (
      <Aux>
        <SideAndTopNavBar />
        <main className={styles.Content}>{this.props.children}</main>
      </Aux>
    );
  }
}

export default Layout;
