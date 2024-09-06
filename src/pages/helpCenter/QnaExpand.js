import React, { useEffect } from "react";

export default function QnaExpand({ QnA, currentActive }) {
  useEffect(() => {
    closeAll();
  }, [currentActive]);

  const closeAll = () => {
    const Allopens = document.querySelectorAll(".clsremove");
    Allopens.forEach((Elemopen) => {
      Elemopen.classList.remove("open");
    });
  };

  const handleClick = (e) => {
    closeAll();
    e.currentTarget.classList.toggle("open");
  };

  return (
    <div class="topicinfo">
      <div onClick={(e) => handleClick(e)} class="infoquestion clsremove">
        <div class="infoquestionhead">
          <div class="infoquestionleft">
            <small class="infohead">{QnA.info2}</small>
            <p class="infotitle">{QnA.info1}</p>
          </div>
          <div class="infoquestionplus"></div>
        </div>
        <div class="infoanswer">
          {" "}
          <div dangerouslySetInnerHTML={{ __html: QnA.info3 }} />
        </div>
      </div>
    </div>
  );
}
