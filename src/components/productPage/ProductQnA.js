import React from "react";
import "./ProductQnA.css";
import { ReactComponent as Questionsvg } from "../../images/productpage/question.svg";
import { ReactComponent as Answersvg } from "../../images/productpage/answer.svg";

export default function ProductQnA() {
  return (
    <div class="prodowncont">
      <div class="prodownsub">
        <div class="headingcont">Buyer Questions and Answers (54)</div>
        <hr />

        <div class="qnacont">
          <div class="qnarow">
            <Questionsvg class="qnasvg" />
            <div class="qnaquestion">What is what</div>
          </div>
          <div class="qnarow">
            <Questionsvg class="qnasvg" />
            <div class="qnaans">im ans</div>
          </div>
        </div>

        <div class="qnacont">
          <div class="qnarow">
            <Questionsvg class="qnasvg" />
            <div class="qnaquestion">What is what</div>
          </div>
          <div class="qnarow">
            <Answersvg class="qnasvg" />
            <div class="qnaans">im ans</div>
          </div>
        </div>
        <div class="qnacont">
          <div class="qnarow">
            <Questionsvg class="qnasvg" />
            <div class="qnaquestion">What is what</div>
          </div>
          <div class="qnarow">
            <Answersvg class="qnasvg" />
            <div class="qnaans">im ans</div>
          </div>
        </div>
        <div class="qnacont">
          <div class="qnarow">
            <Questionsvg class="qnasvg" />
            <div class="qnaquestion">What is what</div>
          </div>
          <div class="qnarow">
            <Answersvg class="qnasvg" />
            <div class="qnaans">im ans</div>
          </div>
        </div>
        <div class="qnacont">
          <div class="qnarow">
            <Questionsvg class="qnasvg" />
            <div class="qnaquestion">What is what</div>
          </div>
          <div class="qnarow">
            <Answersvg class="qnasvg" />
            <div class="qnaans">im ans</div>
          </div>
        </div>
      </div>

      <div class="pagination">here will be pagination</div>
    </div>
  );
}
