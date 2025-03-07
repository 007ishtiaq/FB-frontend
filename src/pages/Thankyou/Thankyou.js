import React, { useEffect } from "react";
import "./thankyou.css";
import { runConfetti } from "../../utils/utils";

export default function Thankyou({ match, history }) {
  const { orderId } = match.params;

  useEffect(() => {
    runConfetti();
  }, []);

  return (
    <div class="contactmaincont">
      <div class="contacttopcont">
        <div class="thankcont">
          <p class="thankmain">Thank You!</p>
          <p class="thanksub">
            Thank You for visiting <span>Crystoos</span> website. You will{" "}
            <br /> received an email message shortly.{" "}
          </p>
          <div class="thanksvg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              shape-rendering="geometricPrecision"
              text-rendering="geometricPrecision"
              image-rendering="optimizeQuality"
              fill-rule="evenodd"
              clip-rule="evenodd"
              viewBox="0 0 512 467.36"
            >
              <g fill-rule="nonzero">
                <path
                  fill="#333"
                  d="M58.327 0h254.296c-11.984 13.787-22.844 27.299-32.641 40.444H58.327c-4.929 0-9.415 2.01-12.656 5.227a17.95 17.95 0 00-5.227 12.657v350.705c0 4.868 2.04 9.331 5.288 12.579 3.264 3.263 7.75 5.304 12.595 5.304h395.345c4.815 0 9.286-2.056 12.557-5.327 3.271-3.271 5.326-7.742 5.326-12.556V211.536A1199.255 1199.255 0 00512 194.294v214.739c0 15.995-6.611 30.592-17.173 41.154-10.562 10.562-25.159 17.173-41.155 17.173H58.327c-15.996 0-30.623-6.58-41.193-17.15C6.595 439.671 0 425.082 0 409.033V58.328C0 26.298 26.298 0 58.327 0z"
                />
                <path
                  fill="#01A601"
                  d="M137.419 167.477l62.691-.825a10.042 10.042 0 015.427 1.513c12.678 7.329 24.639 15.69 35.789 25.121a243.712 243.712 0 0122.484 21.681c21.972-34.811 48.576-70.325 76.509-103.639 34.552-41.2 71.358-79.245 104.09-108.6a10.045 10.045 0 016.718-2.567l48.071-.039c5.579 0 10.111 4.532 10.111 10.111 0 2.752-1.108 5.259-2.896 7.077-44.311 49.249-89.776 105.68-130.969 163.496-38.09 53.466-72.596 108.194-99.23 159.612-2.553 4.945-8.644 6.894-13.588 4.341a10.07 10.07 0 01-4.693-5.105c-14.582-31.196-32.052-59.924-52.916-85.679-20.887-25.778-45.244-48.645-73.567-68.087-4.593-3.134-5.777-9.423-2.644-14.016 2.002-2.935 5.296-4.479 8.613-4.395z"
                />
              </g>
            </svg>
          </div>
          <p class="thankend">Check your Email</p>
          <p class="idinfo">
            Order ID: <span>{orderId}</span>
          </p>
          <p class="thankendsub">
            If you didn't receive any email contact{" "}
            <span>info@crystoos.com</span>{" "}
          </p>
        </div>
      </div>
    </div>
  );
}
