import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getProduct,
  getSimilar,
  // getRelated,
  productStar,
} from "../functions/product";
import { toast } from "react-hot-toast";
import { Online } from "react-detect-offline";
import ProductCard from "../components/cards/ProductCard";
import ProductInfo from "../components/productPage/ProductInfo";
import ProductDescription from "../components/productPage/ProductDescription";
import ProductServices from "../components/productPage/ProductServices";
import ProductQnA from "../components/productPage/ProductQnA";
import ProductReviews from "../components/productPage/ProductReviews";

const Product = ({ match, history }) => {
  const [product, setProduct] = useState({});
  const [similarProduct, setSimilarProduct] = useState([]);
  // const [related, setRelated] = useState([]);
  const [star, setStar] = useState(0);
  const [productIdforreview, setProductIdforreview] = useState("");
  const [comment, setComment] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  // redux
  const { user } = useSelector((state) => ({ ...state }));

  const { slug } = match.params;
  const dispatch = useDispatch();

  useEffect(() => {
    loadSingleProduct();
  }, [slug, Online]);

  useEffect(() => {
    if (product.ratings && user) {
      let existingRatingObject = product.ratings.find(
        (ele) => ele.postedBy && ele.postedBy.toString() === user._id.toString()
      );
      if (existingRatingObject) {
        setStar(existingRatingObject.star);
        setComment(existingRatingObject.comment);
      }
    }
  }, [modalVisible, product.ratings, user]);

  const loadSingleProduct = async () => {
    if (navigator.onLine) {
      await getProduct(slug)
        .then((res) => {
          setProduct(res.data);

          // load Similar
          getSimilar(res.data.slug).then((res) => setSimilarProduct(res.data));

          // load related
          // getRelated(res.data._id).then((res) => setRelated(res.data));
        })
        .catch((error) => {
          if (error.response && error.response.status === 404) {
            toast.error(error.response.data.error);
            history.push("/404");
            // console.error("Brand not found:", error);
          } else if (error.response && error.response.status === 500) {
            toast.error(error.response.data.error);
          } else {
            // Handle other errors
            toast.error("Error fetching Product");
            // console.error("Error fetching Product:", error);
          }
        });
    } else {
      dispatch({
        type: "SET_NETMODAL_VISIBLE",
        payload: true,
      });
    }
  };

  const onModalok = () => {
    if (navigator.onLine) {
      productStar(productIdforreview, { star, comment }, user.token).then(
        (res) => {
          toast.success("Thanks for your review. It will appear soon");
          loadSingleProduct();
        }
      );
    } else {
      dispatch({
        type: "SET_NETMODAL_VISIBLE",
        payload: true,
      });
    }
  };

  const onStarClick = (newRating, name) => {
    setStar(newRating);
    setProductIdforreview(name);
  };

  return (
    <>
      <ProductInfo product={product} similarProduct={similarProduct} />
      <ProductDescription />
      <ProductServices />
      {/* <ProductQnA /> */}
      <ProductReviews
        product={product}
        productslug={slug}
        onStarClick={onStarClick}
        onModalok={onModalok}
        star={star}
        comment={comment}
        setComment={setComment}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
      <Online onChange={loadSingleProduct} />
      {/* ---related products disabled temporarily--- */}
      {/* <div className="container-fluid">
        <div className="row">
          <div className="col text-center pt-5 pb-5">
            <hr />
            <h4>Related Products</h4>
            <hr />
          </div>
        </div>

        <div className="row pb-5">
          {related.length ? (
            related.map((r) => (
              <div key={r._id} className="col-md-4">
                <ProductCard product={r} />
              </div>
            ))
          ) : (
            <div className="text-center col">No Products Found</div>
          )}
        </div>
      </div> */}
    </>
  );
};

export default Product;
