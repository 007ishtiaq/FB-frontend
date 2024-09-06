import React, { useState, useEffect } from "react";
import "./policiesStyle.css";
import "../contactUs/contactus.css";
import { getRelatedStaticText } from "../../functions/staticText";

export default function ReturnandRefundPolicy() {
  const [staticTexts, setStaticTexts] = useState([]);

  useEffect(() => {
    getRelatedStaticText("ReturnAndRefund").then((t) => setStaticTexts(t.data));
  }, []);

  const htmlToRender = (htmlString) => {
    return <div dangerouslySetInnerHTML={{ __html: htmlString }} />;
  };

  return (
    <main>
      <div class="contactmaincont">
        <div class="contacttopcont">
          <div class="contactheadcont">
            <p>
              {staticTexts && staticTexts.length > 0 && staticTexts[0].info1}
            </p>
          </div>
          <div class="contactsubcont">
            <div class="contectcont">
              <div class="maincontentcont">
                <main class="osh-container static-page" role="main">
                  {htmlToRender(
                    staticTexts &&
                      staticTexts.length > 0 &&
                      staticTexts[0].info2
                  )}
                </main>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
