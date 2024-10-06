import React, { useState } from "react";
import Img from "../productsSlidable/img/Image";
import { Link } from "react-router-dom";
import _ from "lodash";
import Laptop from "../../images/laptop.png";
import { Card } from "antd";
import { showAverage } from "../../functions/rating";
import Skeleton from "react-loading-skeleton";
import { ReactComponent as Editsvg } from "../../images/edit.svg";
import { ReactComponent as Deletesvg } from "../../images/delete.svg";
import { ReactComponent as Reviewssvg } from "../../images/review.svg";
import "./AdminProductCard.css";

const AdminProductCard = ({
  product,
  contWidth,
  FlashSalesCont,
  WidthIdea,
  handleRemove,
}) => {
  const {
    _id,
    title,
    slug,
    price,
    quantity,
    sold,
    images,
    shippingcharges,
    disprice,
    onSale,
  } = product;

  const [imageLoaded, setImageLoaded] = useState(false);

  const widthadjust = () => {
    const rootwidth = document.getElementById("root").clientWidth;

    if (rootwidth >= 1113) {
      return { width: `${(contWidth * 16.32) / 100 - 4}px` };
    }
    if (rootwidth >= 975) {
      return { width: `${(contWidth * 16.29) / 100 - 4}px` };
    }
    if (rootwidth >= 750) {
      return { width: `${(contWidth * 19.5) / 100 - 4}px` };
    }
    if (rootwidth >= 701) {
      return { width: `${(contWidth * 24.5) / 100 - 4}px` };
    }
    if (rootwidth >= 530) {
      return { width: `${(contWidth * 28.0) / 100 - 4}px` };
    }
    if (rootwidth >= 320) {
      return { width: `${(contWidth * 38.8) / 100 - 4}px` };
    }

    // Default case if none of the conditions are met
    return {};
  };

  return (
    <div
      style={FlashSalesCont ? widthadjust() : {}}
      class={`itemcolum ${WidthIdea === "Seachpagewidth" && "searchitemcol"}`}
    >
      <Link class="productanker" to={`/product/${slug}`}>
        {images && images.length ? (
          <>
            <Img
              src={images[0].url}
              alt={title}
              className="imagepart"
              onLoad={() => setImageLoaded(true)}
              style={{ display: imageLoaded ? "block" : "none" }}
              stockstatus={product.quantity < 1 && "imgstockout"}
            />
            {!imageLoaded && (
              <Skeleton
                className="imgskull"
                style={{ display: imageLoaded ? "none" : "inline-block" }}
              />
            )}
          </>
        ) : (
          <span className={product.quantity < 1 && "imgstockout"}>
            <Card cover={<img src={Laptop} />}></Card>
          </span>
        )}
      </Link>
      <div class="textpart">
        {disprice !== null ? (
          <>
            <div class="Pricediv">
              <div class="dis p-side">
                {disprice !== 0 ? (
                  <>
                    <span>$ {Math.floor(disprice)}</span>.
                    {disprice.toFixed(2).split(".")[1]}
                  </>
                ) : (
                  <span>$ FREE</span>
                )}
              </div>
              <div className="dis p-side shippinginfoadmin">
                +{shippingcharges}
              </div>
              <div class="d-persontage">
                -{(100 - (disprice / price) * 100).toFixed(0)}%
              </div>
            </div>
            <div class="dis-side">$ {price.toFixed(2)}</div>
          </>
        ) : (
          <div class="p-side common-p-side">
            {price && (
              <>
                <>
                  <span>$ {Math.floor(price)}</span>.
                  {price.toFixed(2).split(".")[1]}
                </>
                <span className="shippinginfoadmin">+{shippingcharges}</span>
              </>
            )}
          </div>
        )}
        <div
          className={`n-side ${onSale !== "Yes" && "n-more"} ${
            disprice && "n-withdis"
          }`}
        >
          <span>{title}</span>
        </div>
        <div class="remaincount adminprodcard">
          {onSale === "Yes" ? (
            <div class="remaincount-side">{quantity} items left</div>
          ) : (
            <div className="ratingstarsp">
              {product && product.ratings && product.ratings.length > 0 ? (
                showAverage(product)
              ) : (
                <div className="">No rating yet</div>
              )}
            </div>
          )}
          <div className="actionbtns">
            <div className="smallsvgbtncont">
              <Link to={`/AdminPanel?page=AddReview&productID=${_id}`}>
                <Reviewssvg className="smallsvgbtn" />
              </Link>
            </div>
            <div className="smallsvgbtncont">
              <Deletesvg
                onClick={() => handleRemove(slug, images)}
                className="smallsvgbtn"
              />
            </div>
            <div>
              <Link to={`/admin/product/${slug}`}>
                <div className="smallsvgbtncont">
                  <Editsvg className="smallsvgbtn" />
                </div>
              </Link>
            </div>
          </div>
        </div>
        {onSale === "Yes" && quantity > 0 && (
          <div class="stock-count">
            <div
              style={{
                backgroundImage: `linear-gradient(to right, #b81a0a ${
                  100 - (sold / (sold + quantity)) * 100
                }%, #c7c7cd ${100 - (sold / (sold + quantity)) * 100}%)`,
              }}
              class="meter"
            ></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProductCard;
