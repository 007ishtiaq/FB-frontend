import React, { useState } from "react";
import { ReactComponent as Deletesvg } from "../../images/cart/delete.svg";
import { useDispatch } from "react-redux";
import ModalImage from "react-modal-image";
import laptop from "../../images/laptop.png";

export default function ProductCardOnCart({
  product,
  removeDiscountCoupon,
  couponCondition,
  getTotal,
}) {
  const {
    title,
    images,
    disprice,
    shippingcharges,
    price,
    color,
    size,
    quantity,
    count,
  } = product;

  const [qty, setQty] = useState(count);

  let dispatch = useDispatch();

  const handleQuantityChangedec = async (e) => {
    setQty(qty < 2 ? 1 : qty - 1); // Decrease quantity, but not below 1
    let cart = [];

    if (typeof window !== "undefined") {
      // Retrieve cart from local storage
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }

      // Update quantity in cart based on product ID, color, and size
      cart = cart.map((prod) => {
        if (
          prod._id === product._id &&
          prod.color === product.color &&
          prod.size === product.size
        ) {
          // Update the quantity of the specific item (based on size/color selection)
          return { ...prod, count: qty < 2 ? 1 : qty - 1 };
        }
        return prod; // Keep the other items as they are
      });

      // Save updated cart to local storage
      localStorage.setItem("cart", JSON.stringify(cart));

      // Update Redux state with the new cart
      dispatch({
        type: "ADD_TO_CART",
        payload: cart,
      });

      // Recalculate the total cost of the cart
      let totalofCart = cart.reduce((currentValue, nextValue) => {
        if (nextValue.disprice >= 0) {
          return currentValue + nextValue.count * nextValue.disprice;
        } else {
          return currentValue + nextValue.count * nextValue.price;
        }
      }, 0);

      // Remove the discount coupon if the total is below the coupon condition
      if (totalofCart < couponCondition) {
        removeDiscountCoupon();
      }
    }
  };

  const handleQuantityChangeinc = async (e) => {
    setQty(qty > quantity - 1 ? quantity : qty + 1); // Update quantity based on available stock
    let cart = [];

    if (typeof window !== "undefined") {
      // Retrieve cart from local storage
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }

      // Update quantity in cart based on product ID, color, and size
      cart = cart.map((prod) => {
        if (
          prod._id === product._id &&
          prod.color === product.color &&
          prod.size === product.size
        ) {
          // Update the quantity if the product with the same ID, color, and size exists
          return { ...prod, count: qty > quantity - 1 ? quantity : qty + 1 };
        }
        return prod; // Keep the other items as they are
      });

      // Save updated cart to local storage
      localStorage.setItem("cart", JSON.stringify(cart));

      // Update Redux state with the new cart
      dispatch({
        type: "ADD_TO_CART",
        payload: cart,
      });
    }
  };

  const handleRemove = () => {
    const userConfirmed = window.confirm(
      "Are you sure you want to remove this item?"
    );

    if (userConfirmed) {
      let cart = [];

      if (typeof window !== "undefined") {
        // Retrieve cart from local storage
        if (localStorage.getItem("cart")) {
          cart = JSON.parse(localStorage.getItem("cart"));
        }

        // Remove the item from the cart by matching product ID, color, and size
        cart = cart.filter((prod) => {
          return !(
            prod._id === product._id &&
            prod.color === product.color &&
            prod.size === product.size
          );
        });

        // Save the updated cart to local storage
        localStorage.setItem("cart", JSON.stringify(cart));

        // Update Redux state with the new cart
        dispatch({
          type: "ADD_TO_CART",
          payload: cart,
        });

        // Recalculate the total cost of the cart
        let totalofCart = cart.reduce((currentValue, nextValue) => {
          if (nextValue.disprice >= 0) {
            return currentValue + nextValue.count * nextValue.disprice;
          } else {
            return currentValue + nextValue.count * nextValue.price;
          }
        }, 0);

        // Remove the discount coupon if the total is below the coupon condition
        if (totalofCart < couponCondition) {
          removeDiscountCoupon();
        }

        // If the cart is empty, also remove the discount coupon
        if (cart.length === 0) {
          removeDiscountCoupon();
        }
      }
    }
  };

  return (
    <div class="cartprocont">
      <div class="cartproimg">
        {images.length ? (
          <ModalImage small={images[0].url} large={images[0].url} />
        ) : (
          <ModalImage small={laptop} large={laptop} />
        )}
      </div>
      <div class="cartprodetailscont">
        <div class="cartproname">{`${title}`}</div>
        <div class="cartprostockstatus">{quantity > 0 && "In Stock"}</div>
        <div class="cartprovariants">
          <div class="subvariant">
            <span class="varianthead">Color: </span>
            <span class="variantsub">{color}</span>
          </div>
          {size && (
            <div class="subvariant">
              <span class="varianthead">Size: </span>
              <span class="variantsub">{size}</span>
            </div>
          )}

          <div class="subvariant">
            <span class="varianthead">Shipping: </span>
            <span class="variantsub">
              {shippingcharges === 0 ? (
                <div className="freeitemcont">
                  <svg
                    className="deliverysvg"
                    xmlns="http://www.w3.org/2000/svg"
                    shape-rendering="geometricPrecision"
                    text-rendering="geometricPrecision"
                    image-rendering="optimizeQuality"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    viewBox="0 0 512 330.845"
                  >
                    <path d="M95.992 0c35.923 22.768 68.373 33.54 96.223 30.995 4.865 98.382-31.466 156.48-95.852 180.727C34.188 189.028-2.587 133.427.142 29.502 32.834 31.213 64.91 24.144 95.992 0zM76.731 103.923a73.156 73.156 0 016.88 6.658c6.723-10.822 13.89-20.757 21.461-29.895 21.401-25.849 11.702-20.867 41.389-20.867l-4.124 4.581c-12.676 14.086-16.952 21.417-27.343 36.429a425.653 425.653 0 00-27.95 46.499l-2.571 4.96-2.363-5.052c-4.359-9.359-9.581-17.95-15.808-25.625-6.228-7.676-11.667-12.684-20.112-18.479 3.87-12.702 22.288-6.201 30.541.791zm301.485 1.74l-35.138-.243V57.97a25.356 25.356 0 00-7.529-18.079 25.353 25.353 0 00-18.079-7.53H213.806c-.435 4.496-1.122 9.147-1.833 13.884H317.47c3.218 0 6.159 1.334 8.278 3.449 2.116 2.12 3.45 5.061 3.45 8.276v217.288H290.06a6.93 6.93 0 00-6.94 6.944 6.925 6.925 0 006.94 6.938h46.077a6.926 6.926 0 006.941-6.938v-7.885h28.044c3.177-72.232 106.9-82.195 117.451 0h22.782c5.868-70.433-28.909-97.805-81.803-103.996-3.805-16.53-11.062-31.874-19.26-47.037-9.747-18.025-12.016-17.297-32.076-17.621zM147.08 275.222a6.929 6.929 0 016.944 6.939 6.93 6.93 0 01-6.944 6.941H73.343c-7.022 0-13.413-3.06-18.082-7.882-4.623-4.821-7.527-11.411-7.527-18.392v-48.35a138.893 138.893 0 0013.881 7.815v40.535c0 3.334 1.375 6.51 3.609 8.824 2.119 2.197 4.98 3.606 8.077 3.606h73.779v-.036zm70.59-38.416c-25.963 0-47.019 21.059-47.019 47.019 0 25.961 21.056 47.02 47.019 47.02 25.961 0 47.017-21.059 47.017-47.02-.038-25.96-21.056-47.019-47.017-47.019zm0 28.942c-9.96 0-18.08 8.08-18.08 18.077 0 9.961 8.08 18.082 18.08 18.082 9.959 0 18.079-8.081 18.079-18.082-.042-9.997-8.12-18.077-18.079-18.077zm212.039-35.86c-25.959 0-47.016 21.059-47.016 47.018 0 25.96 21.057 47.021 47.016 47.021 25.963 0 47.02-21.061 47.02-47.021 0-25.959-21.057-47.018-47.02-47.018zm-18.077 47.018c0 9.961 8.076 18.079 18.077 18.079 10.001 0 18.079-8.077 18.079-18.079 0-9.999-8.078-18.076-18.079-18.076-9.978 0-18.077 8.095-18.077 18.076zm-30.038-151.174l-21.182-.392v45.06h44.866c-5.534-16.073-13.724-30.807-23.684-44.668zM96.049 14.47c30.429 19.287 59.636 30.128 83.227 27.971 4.118 83.335-28.373 134.27-82.908 154.808-52.671-19.224-85.542-68.035-83.23-156.073C43.7 42.778 71.71 33.379 96.049 14.47z" />
                  </svg>
                  <span>Free shipping</span>
                </div>
              ) : (
                `$ ${shippingcharges.toFixed(2)}`
              )}
            </span>
          </div>
        </div>
      </div>
      <div class="cartpropricedetails">
        {disprice !== null ? (
          <div className="cartpricebinder">
            <div class="cartproprice">$ {disprice.toFixed(2)}</div>
            <div class="cartprocutcont">
              <div class="cartpropricelist">$ {price.toFixed(2)}</div>
              <div class="dis-persontage">
                {" "}
                -{(100 - (disprice / price) * 100).toFixed(0)}%{" "}
              </div>
            </div>
          </div>
        ) : (
          <div class="cartproprice">$ {price.toFixed(2)}</div>
        )}
        <div class="cartprobtns">
          <div onClick={handleRemove} class="cartprodel">
            <Deletesvg />
          </div>
          <div class="cartproqtycont">
            {quantity > 0 ? (
              <div className="mybtn qtybtnsize cartqtybtncont">
                <a
                  disabled={qty === 1}
                  className={qty === 1 && "qtymin"}
                  onClick={handleQuantityChangedec}
                >
                  -
                </a>
                <span>{qty}</span>
                <a
                  disabled={qty === quantity}
                  className={qty === quantity && "qtymax"}
                  onClick={handleQuantityChangeinc}
                >
                  +
                </a>
              </div>
            ) : (
              <div className="qtybtnsize">
                <a disabled className="qtymin">
                  -
                </a>
                <span>{0}</span>
                <a disabled className="qtymax">
                  +
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
