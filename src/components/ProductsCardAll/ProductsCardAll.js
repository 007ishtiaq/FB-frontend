import React, { useState, useEffect } from "react";
import "./ProductsCardAll.css";
import "../ProductCards/ProductCardsAll.css";
import Img from "../../components/productsSlidable/img/Image";
import { Card } from "antd";
import Laptop from "../../images/laptop.png";
import { showAverage } from "../../functions/rating";
import { toast } from "react-hot-toast";
import _ from "lodash";
import { useSelector, useDispatch } from "react-redux";
import img2 from "../../images/productdiv_sample_images/3.jpg";
import "../../pages/shop/searchstyle.css";
import FlashsaleProductCard from "../ProductCards/FlashsaleProductCard";
import Skeleton from "react-loading-skeleton";
import ProductCardSkull from "../Skeletons/ProductCardSkull";
import NoItemFound from "../cards/NoItemFound/NoItemFound";
import ProductCountdowns from "../countdown/ProductCountdowns";

export default function ProductsCardAll({
  products,
  loading,
  flash,
  getcurrentFlash,
}) {
  const [contwidth, setContwidth] = useState(0);

  let dispatch = useDispatch();

  useEffect(() => {
    const proarea = document.querySelector(".productsarea");
    const contwidth = proarea.clientWidth;
    setContwidth(contwidth);
  }, []);

  return (
    <div className="cardcontainer">
      <div className="insidecont">
        <div className="belowside">
          <div class="proright fullprods">
            <div class={`rightsideheadercont ${flash && "flashheadcont"}`}>
              <div class="headingname">
                {loading ? (
                  <Skeleton width={150} count={1} />
                ) : (
                  <div class="foundpros">
                    {products.length}{" "}
                    {products.length > 1 ? "Products" : "Product"} found
                  </div>
                )}
              </div>
              {flash && loading ? (
                <Skeleton width={150} count={1} />
              ) : (
                flash && (
                  <div class="headingright">
                    <ProductCountdowns
                      products={products}
                      getcurrentFlash={getcurrentFlash}
                    />
                  </div>
                )
              )}
              {loading ? (
                <Skeleton width={150} count={1} />
              ) : (
                <div class="headingright">
                  <span>Sort By: </span>
                  <span class="sortoptions">Popularity</span>
                </div>
              )}
            </div>

            <div class="contentcont">
              <div class="productsarea">
                {loading ? (
                  <ProductCardSkull clone={10} contWidth={contwidth} />
                ) : (
                  products &&
                  products.map((prod) => (
                    <FlashsaleProductCard
                      key={prod._id}
                      product={prod}
                      contWidth={contwidth}
                      WidthIdea={"Fullwidth"}
                    />
                  ))
                )}
                {loading ? "" : products.length < 1 && <NoItemFound />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

{
  /* <div className="emptyprodcont">
                        <div className="Emptyprodssvg">
                          <NoOrdersFoundsvg />
                        </div>
                        <p className="empttxt">No Orders Found!</p>
                        <p className="empttxtsubtxt">
                          Explore more and shortlist some items
                        </p>
                        <div className="gohomebtncont">
                          <Link to="/">
                            <button>
                              <div>
                                <Returnsvg />
                              </div>
                              <span>Continue Shopping</span>
                            </button>
                          </Link>
                        </div>
                      </div> */
}
