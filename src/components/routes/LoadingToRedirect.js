import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import "./LoadingToRedirect.css";
import { Link } from "react-router-dom";

const LoadingToRedirect = () => {
  const [count, setCount] = useState(6);
  let history = useHistory();

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((currentCount) => --currentCount);
    }, 1000);
    // redirect once count is equal to 0
    count === 0 && history.push("/");
    // cleanup
    return () => clearInterval(interval);
  }, [count, history]);

  return (
    <div>
      <section class="page_404">
        <div class="container">
          <div class="row">
            <div class="col-sm-12 ">
              <div class="text-center">
                <div class="four_zero_four_bg"></div>

                <div class="contant_box_404 redirectbottom">
                  <h3 class="h2">Look like you're lost</h3>

                  <p>Redirecting you in {count} seconds</p>

                  <Link to={`/`}>
                    {" "}
                    <a href="" class="mybtn btnprimary link_404">
                      {" "}
                      Go to Home{" "}
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LoadingToRedirect;
