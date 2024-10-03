import React from "react";
import "./productservices.css";
import { ReactComponent as Packagereturn } from "../../images/productpage/packagereturn.svg";
import { ReactComponent as Delivery } from "../../images/productpage/delivery.svg";
import { ReactComponent as Extendwarranty } from "../../images/productpage/extendwarranty.svg";
import { ReactComponent as Support } from "../../images/productpage/support.svg";

export default function ProductServices() {
  return (
    <div class="prodowncont">
      <div class="prodownsub">
        <div class="headingcont">
          <span> Warrenty & Service </span>
        </div>
        <hr />

        <div class="servicescont">
          <div class="servicesub">
            <Packagereturn class="serviceimg"></Packagereturn>
            <div class="serviceinfo">
              <div class="headingcont"> 15 Days </div>
              <div class="">
                {" "}
                Enjoy 15 days to return if any quality problems ascascsac
                ascascascas
              </div>
            </div>
          </div>
          <div class="servicesub">
            <Delivery class="serviceimg"></Delivery>
            <div class="serviceinfo">
              <div class="headingcont"> Delivery Time </div>
              <div class="">
                {" "}
                Most items will be delivered whithin 48 hours{" "}
              </div>
            </div>
          </div>
          <div class="servicesub">
            <Extendwarranty class="svgwarranty" />
            <div class="serviceinfo">
              <div class="headingcont"> 1 Year </div>
              <div class="">
                {" "}
                All products have 1 year warranty from our store fdvdfvdf
                dfvdfvdf dfvdfvdfv
              </div>
            </div>
          </div>
          <div class="servicesub">
            <Support class="serviceimg"></Support>
            <div class="serviceinfo">
              <div class="headingcont"> Shipping Help </div>
              <div class="">
                {" "}
                Alll Emails will be answered whithin 24 hours{" "}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
