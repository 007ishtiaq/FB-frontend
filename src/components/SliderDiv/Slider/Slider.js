import React, { useState, useEffect } from "react";
import { ReactComponent as Rightsvg } from "../../../images/homepage/leftbtn.svg";
import { ReactComponent as Leftsvg } from "../../../images/homepage/rightbtn.svg";
import classes from "./Slider.module.css";
import { getRelatedBanners } from "../../../functions/banner";
import { Link } from "react-router-dom";
import MainSliderSkull from "../../Skeletons/MainSliderSkull";

const Slider = () => {
  const [index, setIndex] = useState(4);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    getRelatedBanners("Slider").then((b) => {
      setLoading(false);
      setBanners(b.data);
    });
  }, []);

  const clickhandlerdot = (i) => {
    setIndex(i);
  };
  const clickhandler = (dir) => {
    if (dir === "left") {
      setIndex(index < banners.length - 1 ? index + 1 : 0);
    } else {
      setIndex(index > 0 ? index - 1 : banners.length - 1);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      clickhandler();
    }, 5000);
    return () => clearTimeout(timer);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const dotes = Array.from({ length: banners.length }).map((x, i) => {
    return (
      <div
        key={i}
        className={index === i ? classes.active : classes.dot}
        onClick={() => clickhandlerdot(i)}
      ></div>
    );
  });

  return (
    <>
      {loading ? (
        <MainSliderSkull />
      ) : (
        <div className={classes.Slider}>
          <div className={classes.dotes}>{dotes}</div>
          <div className={classes.right} onClick={() => clickhandler("right")}>
            <div className={classes.rightIconContainer}>
              <Leftsvg style={{ width: "10px", fill: "white" }} />
            </div>
          </div>

          {banners.map((slide, i) => (
            <Link to={banners[index].link} key={slide._id}>
              <div
                key={slide._id}
                className={
                  i === index
                    ? [classes.item, classes.anim].join(" ")
                    : classes.item
                }
              >
                <img
                  src={slide.image.url}
                  alt="slideItem"
                  onLoad={() => setImageLoaded(true)}
                  style={{ display: imageLoaded ? "block" : "none" }}
                />
                {!imageLoaded && (
                  <MainSliderSkull
                    style={{ display: imageLoaded ? "none" : "inline-block" }}
                  />
                )}
              </div>
            </Link>
          ))}

          <div className={classes.left} onClick={() => clickhandler("left")}>
            <div className={classes.leftIconContainer}>
              <Rightsvg style={{ width: "10px", fill: "white" }} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(Slider);
