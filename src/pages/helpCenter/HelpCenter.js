import React, { useState, useEffect } from "react";
import "./helpcenter.css";
import QnaExpand from "./QnaExpand";
import Placeanorder from "./Placeanorder";
import Payfororder from "./Payfororder";
import Trackyourorder from "./Trackyourorder";
import Cancelorder from "./Cancelorder";
import Returnorder from "./Returnorder";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import { getRelatedStaticText } from "../../functions/staticText";

// ---------------------temp data start--------------------
// const data = {
//   Nav: [
//     {
//       head: "Payments",
//       headimg: "./images/helpcenter/payments.jpg",
//     },
//   ],
//   QnA: [
//     {
//       infohead: "Payments",
//       infoquestion: "When will my order be delivered?",
//       infoanswer:
//         "<p> We accepts a variety of payment methods p1: </p><p> • <strong> Pay on Delivery </strong> allows for payment in cash, or with credit/debit card, bank transfer, or Mastercard upon delivery. </p><p> • <strong>JumiaPay</strong> accepts payment through Mastercard, Visa Verve, cards, bank transfers, or card payments. </p><p>• <strong>Vouchers</strong> allow you to pay using a voucher code</p>",
//     },
//     {
//       infohead: "Payments",
//       infoquestion: "When will my order be delivered?",
//       infoanswer:
//         "<p> We accepts a variety of payment methods p2: </p><p> • <strong> Pay on Delivery </strong> allows for payment in cash, or with credit/debit card, bank transfer, or Mastercard upon delivery. </p> <p> • <strong>JumiaPay</strong> accepts payment through Mastercard, Visa Verve, cards, bank transfers, or card payments. </p><p>• <strong>Vouchers</strong> allow you to pay using a voucher code</p>",
//     },
//     {
//       infohead: "Vouchers",
//       infoquestion: "When will my order be delivered?",
//       infoanswer:
//         "<p> We accepts a variety of payment methods v1: </p><p> • <strong> Pay on Delivery </strong> allows for payment in cash, or with credit/debit card, bank transfer, or Mastercard upon delivery. </p> <p> • <strong>JumiaPay</strong> accepts payment through Mastercard, Visa Verve, cards, bank transfers, or card payments. </p><p>• <strong>Vouchers</strong> allow you to pay using a voucher code</p>",
//     },
//     {
//       infohead: "Vouchers",
//       infoquestion: "When will my order be delivered?",
//       infoanswer:
//         "<p> We accepts a variety of payment methods v2: </p><p> • <strong> Pay on Delivery </strong> allows for payment in cash, or with credit/debit card, bank transfer, or Mastercard upon delivery. </p> <p> • <strong>JumiaPay</strong> accepts payment through Mastercard, Visa Verve, cards, bank transfers, or card payments. </p><p>• <strong>Vouchers</strong> allow you to pay using a voucher code</p>",
//     },
//     {
//       infohead: "Delivery",
//       infoquestion: "When will my order be delivered?",
//       infoanswer:
//         "<p> We accepts a variety of payment methods v2: </p><p> • <strong> Pay on Delivery </strong> allows for payment in cash, or with credit/debit card, bank transfer, or Mastercard upon delivery. </p> <p> • <strong>JumiaPay</strong> accepts payment through Mastercard, Visa Verve, cards, bank transfers, or card payments. </p><p>• <strong>Vouchers</strong> allow you to pay using a voucher code</p>",
//     },
//     {
//       infohead: "Delivery",
//       infoquestion: "When will my order be delivered?",
//       infoanswer:
//         "<p> We accepts a variety of payment methods v2: </p><p> • <strong> Pay on Delivery </strong> allows for payment in cash, or with credit/debit card, bank transfer, or Mastercard upon delivery. </p> <p> • <strong>JumiaPay</strong> accepts payment through Mastercard, Visa Verve, cards, bank transfers, or card payments. </p><p>• <strong>Vouchers</strong> allow you to pay using a voucher code</p>",
//     },
//     {
//       infohead: "Returns & Refunds",
//       infoquestion: "When will my order be delivered?",
//       infoanswer:
//         "<p> We accepts a variety of payment methods v2: </p><p> • <strong> Pay on Delivery </strong> allows for payment in cash, or with credit/debit card, bank transfer, or Mastercard upon delivery. </p> <p> • <strong>JumiaPay</strong> accepts payment through Mastercard, Visa Verve, cards, bank transfers, or card payments. </p><p>• <strong>Vouchers</strong> allow you to pay using a voucher code</p>",
//     },
//     {
//       infohead: "Returns & Refunds",
//       infoquestion: "When will my order be delivered?",
//       infoanswer:
//         "<p> We accepts a variety of payment methods v2: </p><p> • <strong> Pay on Delivery </strong> allows for payment in cash, or with credit/debit card, bank transfer, or Mastercard upon delivery. </p> <p> • <strong>JumiaPay</strong> accepts payment through Mastercard, Visa Verve, cards, bank transfers, or card payments. </p><p>• <strong>Vouchers</strong> allow you to pay using a voucher code</p>",
//     },
//   ],
//   BigNav: [
//     {
//       unique: "Place",
//       head: "How to Place an Order",
//       headimg: "./images/helpcenter/1.png",
//     },
//     {
//       unique: "Pay",
//       head: "How to Pay for Your Order",
//       headimg: "./images/helpcenter/2.png",
//     },
//     {
//       unique: "Track",
//       head: "How to Track Your Order",
//       headimg: "./images/helpcenter/3.png",
//     },
//     {
//       unique: "Cancel",
//       head: "How to Cancel an Order",
//       headimg: "./images/helpcenter/4.png",
//     },
//     {
//       unique: "Return",
//       head: "How to Create a Return",
//       headimg: "./images/helpcenter/5.png",
//     },
//   ],
// };

// ---------------------temp data end--------------------

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function HelpCenter() {
  const [currentActive, setCurrentActive] = useState("");
  const [qnAdata, setQnAdata] = useState([]);
  const [bigNav, setBigNav] = useState([]);
  const [sidenav, setSidenav] = useState([]);
  const [QnA, setQnA] = useState([]);

  let query = useQuery();

  useEffect(() => {
    getRelatedStaticText("HelpCenter-BigNav").then((res) =>
      setBigNav(res.data)
    );
    getRelatedStaticText("HelpCenter-SideNav").then((res) =>
      setSidenav(res.data)
    );
    getRelatedStaticText("HelpCenter-QNA").then((res) => setQnA(res.data));
  }, []);

  // const htmlToRender = (htmlString) => {
  //   return <div dangerouslySetInnerHTML={{ __html: htmlString }} />;
  // };

  useEffect(() => {
    setCurrentActive(query.get("page"));
    QnAdatacalc(query.get("page"));

    const Allactives = document.querySelectorAll(".clsremove");
    Allactives.forEach((Elemactive) => {
      Elemactive.classList.remove("active");
    });

    const timeoutId = setTimeout(() => {
      const default_active = document.querySelector(`.${query.get("page")}`);
      if (default_active) {
        default_active.classList.add("active");
      }
      if (default_active === null) {
        document.querySelector(`.Payments`).classList.add("active");
        QnAdatacalc(`Payments`);
      }

      return () => clearTimeout(timeoutId);
    }, 100);
  }, [query.get("page"), QnA]);

  const handleClick = (e, name) => {
    const Allactives = document.querySelectorAll(".clsremove");
    Allactives.forEach((Elemactive) => {
      Elemactive.classList.remove("active");
    });
    e.currentTarget.classList.toggle("active");
    setCurrentActive(name);
    console.log("my name is", name);
    QnAdatacalc(name);
  };

  const QnAdatacalc = (name) => {
    const filteredData = QnA.filter((data) => data.info2 === name);
    setQnAdata(filteredData);
  };

  return (
    <>
      <main>
        <div class="helpmaincont">
          <div class="helptopcont">
            <span>Help Center</span>
            <h5>Hi, how can we help you? </h5>
          </div>
          <div class="helpbelowcont">
            <div class="helpguidecont">
              <div class="guideboxcont">
                {bigNav.map((n, i) => (
                  <div
                    onClick={(e) => handleClick(e, n.info1)}
                    className={`guidebox clsremove ${n.info1}`}
                    key={i}
                  >
                    <p>{n.info2}</p>
                    <img src={n.image.url} alt="" />
                  </div>
                ))}
              </div>
            </div>
            <div class="topicscont">
              <div class="topicsheadscont">
                <div class="topicshead">
                  <div class="infotopics">
                    {sidenav &&
                      sidenav.length > 0 &&
                      sidenav.map((n, i) => (
                        <div
                          onClick={(e) => handleClick(e, n.info1)}
                          class={`topic clsremove ${n.info1}`}
                          key={i}
                        >
                          <div class="leftinfo">
                            <span>
                              <img src={n.image.url} alt="" />
                            </span>
                            <p>{n.info1}</p>
                          </div>
                          <div class="rightexpand">
                            <span></span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
              <div class="topicsinforight">
                <div class="topicsinfocont">
                  {currentActive !== "Place" &&
                    currentActive !== "Pay" &&
                    currentActive !== "Track" &&
                    currentActive !== "Cancel" &&
                    currentActive !== "Return" &&
                    qnAdata.map((q, i) => (
                      <QnaExpand
                        QnA={q}
                        key={i}
                        currentActive={currentActive}
                      />
                    ))}

                  {currentActive === "Place" && <Placeanorder></Placeanorder>}
                  {currentActive === "Pay" && <Payfororder></Payfororder>}
                  {currentActive === "Track" && (
                    <Trackyourorder></Trackyourorder>
                  )}
                  {currentActive === "Cancel" && <Cancelorder></Cancelorder>}
                  {currentActive === "Return" && <Returnorder></Returnorder>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
