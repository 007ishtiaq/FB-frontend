import React, { useEffect, useState } from "react";
import FlashsaleProductCard from "../../ProductCards/FlashsaleProductCard";
import ProductsSlider from "../productSlider/ProductsSlider";
// import Countdown from "../../countdown/Countdown";
import ProductCountdowns from "../../countdown/ProductCountdowns";
import { getcurrentFlash } from "../../../functions/product";
import { Link } from "react-router-dom";
import ProductCardSkull from "../../Skeletons/ProductCardSkull";

const ProductsGroup = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [contwidth, setContwidth] = useState(0);
  const [elementwidth, setElementwidth] = useState(0);

  useEffect(() => {
    getcurrentFlash().then((p) => {
      setLoading(false);
      setProducts(p.data);
    });
  }, []);

  useEffect(() => {
    const proarea = document.querySelector(".productsarea");
    const contwidth = proarea.clientWidth;
    setContwidth(contwidth);
    const rootwidth = document.getElementById("root").clientWidth;
    if (rootwidth >= 1113) {
      setElementwidth((contwidth * 16.32) / 100 - 4 + 8);
    } else if (rootwidth >= 975) {
      setElementwidth((contwidth * 16.29) / 100 - 4 + 8);
    } else if (rootwidth >= 745) {
      setElementwidth((contwidth * 19.5) / 100 - 4 + 7);
    } else if (rootwidth >= 659) {
      setElementwidth((contwidth * 24.5) / 100 - 4 + 7);
    } else if (rootwidth >= 602) {
      setElementwidth((contwidth * 24.4) / 100 - 4 + 6.4);
    } else if (rootwidth >= 457) {
      setElementwidth((contwidth * 32.5) / 100 - 4 + 6.4);
    } else if (rootwidth <= 456) {
      setElementwidth((contwidth * 48.5) / 100 - 4 + 6.4);
    }
  }, [contwidth]);

  return (
    <>
      <div class="cardcontainer">
        <div class="insidecont">
          <div class="mainhead flashhead">
            <div class="colorheading">Flash Sales</div>
            <ProductCountdowns
              products={products}
              getcurrentFlash={getcurrentFlash}
            />

            <Link to={`/Flashsale`}>
              <div class="colormore">SEE MORE</div>
            </Link>
          </div>
          <div class="contentcont">
            <div class="productsarea">
              <ProductsSlider
                elementwidth={elementwidth}
                containerwidth={contwidth}
                step={elementwidth * 3}
              >
                {loading ? (
                  <ProductCardSkull
                    clone={6}
                    contWidth={contwidth}
                    FlashSalesCont={true}
                  />
                ) : (
                  products &&
                  products.map((prod) => (
                    <FlashsaleProductCard
                      key={prod._id}
                      product={prod}
                      contWidth={contwidth}
                      FlashSalesCont={true}
                    />
                  ))
                )}
              </ProductsSlider>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default React.memo(ProductsGroup);
