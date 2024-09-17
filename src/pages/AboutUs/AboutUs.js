import React from "react";
import "./AboutUs.css";
import { ReactComponent as Percentsvg } from "../../images/AboutUs/percent.svg";
import { ReactComponent as Supportsvg } from "../../images/AboutUs/callsupport.svg";
import { ReactComponent as Deliverysvg } from "../../images/AboutUs/cardelivery.svg";
import { ReactComponent as Bestpricesvg } from "../../images/AboutUs/goodprice.svg";
import visionimg from "../../images/vision/visionimg.png";

export default function AboutUs() {
  return (
    <div class="aboutcont">
      <div class="abouttitle">About Us</div>
      <div class="aboutvisioncont">
        <div class="aboutvisionimgcont">
          <div className="visionimgside">
            <img src={visionimg} alt="" />
          </div>
          <div className="visiontextside">
            <h2 className="visionhead">Vision</h2>
            <p>
              We are building the most beloved and trusted shopping destination
              for United State.
            </p>
          </div>
        </div>
        <div class="visionservicescont">
          <div class="visionservice">
            <div class="visionservicesvg">
              <Percentsvg />
            </div>
            <div class="visionservicetxt">
              Access 100% <span>Genuine</span> Products from Local &
              International Vendors{" "}
            </div>
          </div>
          <div class="visionservice">
            <div class="visionservicesvg">
              <Supportsvg />
            </div>
            <div class="visionservicetxt">
              Buy Anything You want online at the <span>Best</span> Prices
            </div>
          </div>
          <div class="visionservice">
            <div class="visionservicesvg">
              <Deliverysvg />
            </div>
            <div class="visionservicetxt">
              Search, Order on all Platforms Pay on Delivery
            </div>
          </div>
          <div class="visionservice">
            <div class="visionservicesvg">
              <Bestpricesvg />
            </div>
            <div class="visionservicetxt">
              Assisting Our Customers for the best Shopping Experience
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
