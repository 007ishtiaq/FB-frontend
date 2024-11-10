import React from "react";
import "./BurdermenuSmall.css";
import Burdermenu from "../../Burgermenu/Burdermeun";
import SideDrawer from "../../SideDrawer/SideDrawer";
import NavItemes from "../../navItems/NavItemes";
import { useDispatch, useSelector } from "react-redux";

//small size left drawer - all components here
const BurdermenuSmall = () => {
  const { mobileSideNav } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();

  const toggle = () => {
    dispatch({
      type: "SET_SIDENAV_VISIBLE",
      payload: true,
    });
  };
  const close = () => {
    dispatch({
      type: "SET_SIDENAV_VISIBLE",
      payload: false,
    });
  };

  return (
    <>
      <div className="SmallDevices">
        <Burdermenu click={toggle} />
        <SideDrawer Open={mobileSideNav} close={close}>
          <NavItemes />
        </SideDrawer>
      </div>
    </>
  );
};

export default React.memo(BurdermenuSmall);
