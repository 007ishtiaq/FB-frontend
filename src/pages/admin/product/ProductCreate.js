import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { createProduct } from "../../../functions/product";
import ProductCreateForm from "../../../components/forms/ProductCreateForm";
import { getCategories, getCategorySubs } from "../../../functions/category";
import { getSubsSub2 } from "../../../functions/sub";
import FileUpload from "../../../components/forms/FileUpload";
import { LoadingOutlined } from "@ant-design/icons";
import { getColors } from "../../../functions/color";
import axios from "axios";
import { auth } from "../../../firebase"; // Import Firebase auth

const initialState = {
  art: "",
  title: "Macbook Pro",
  description: "This is the best Apple product",
  price: "45000",
  disprice: "",
  shippingcharges: "",
  categories: [],
  category: "",
  quantity: "50",
  weight: "500",
  images: [],
  colors: [],
  color: "",
  size: "",
  onSale: "No",
  saleTime: "",
};

const ProductCreate = () => {
  const [values, setValues] = useState(initialState);
  const [subOptions, setSubOptions] = useState([]);
  const [sub2Options, setSub2Options] = useState([]);
  const [attributes, setAttributes] = useState([{ subs: "", subs2: [] }]);
  const [desattributes, setDesattributes] = useState([{}]);
  const [sizes, setSizes] = useState([
    {
      size: "",
      prices: [
        { type: "price", value: "" },
        { type: "disprice", value: "" },
      ],
    },
  ]);
  const [variants, setVariants] = useState([{ name: "", image: "" }]);
  const [loading, setLoading] = useState(false);

  // redux
  const { user } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      await loadCategories();

      const colorsData = await getColors();
      setValues((prevValues) => ({
        ...prevValues,
        colors: colorsData.data.map((item) => item.name),
      }));
    };

    fetchData();
  }, []);

  const loadCategories = () =>
    getCategories().then((c) => setValues({ ...values, categories: c.data }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...values, attributes, desattributes, variants, sizes };

    try {
      let token = user.token; // Use existing token

      // Attempt API call
      const res = await createProduct(payload, token);

      window.alert(`"${res.data.title}" is created`);
      window.location.reload();
    } catch (err) {
      // If token is expired (401 error), renew token and retry
      if (err.response?.status === 401) {
        try {
          const newToken = await auth.currentUser.getIdToken(true); // Refresh token

          // Update Redux store with new token
          dispatch({
            type: "LOGGED_IN_USER",
            payload: { ...user, token: newToken },
          });

          // Retry API call with new token
          const retryRes = await createProduct(payload, newToken);

          window.alert(`"${retryRes.data.title}" is created`);
          window.location.reload();
        } catch (tokenErr) {
          console.error("Token renewal failed", tokenErr);
        }
      } else {
        // Handle other errors
        console.log(err);
        toast.error(err.response?.data?.error || "Something went wrong.");
      }
    }
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    if (e.target.name === "onSale" && e.target.value === "No")
      setValues({ ...values, onSale: "No", saleTime: "" });
  };

  const handleCatagoryChange = (e) => {
    e.preventDefault();
    setValues({ ...values, category: e.target.value });
    setAttributes([{ subs: "", subs2: [] }]);
    getCategorySubs(e.target.value).then((res) => {
      setSubOptions(res.data);
    });
  };

  const handleSubChange = (index, e) => {
    e.preventDefault();
    const newAttributes = [...attributes];
    const selectedSub = e.target.value;
    newAttributes[index].subs = selectedSub;
    newAttributes[index].subs2 = [];
    setAttributes(newAttributes);

    getSubsSub2(selectedSub).then((res) => {
      setSub2Options(res.data);
    });
  };

  const handleSub2Change = (index, value) => {
    const newAttributes = [...attributes];
    newAttributes[index].subs2 = value;
    setAttributes(newAttributes);
  };

  const addAttribute = () => {
    setAttributes([...attributes, { subs: "", subs2: [] }]);
  };

  const addDesAttribute = () => {
    setDesattributes([...desattributes, {}]);
  };

  const removeDesAttribute = (index) => {
    const updatedDesattributes = desattributes.filter((_, i) => i !== index);
    setDesattributes(updatedDesattributes);
  };

  const handleDesAttributeChange = (index, key, value) => {
    const updatedDesattributes = [...desattributes];
    updatedDesattributes[index] = { [key]: value };
    setDesattributes(updatedDesattributes);
  };

  const addVariants = () => {
    setVariants([...variants, { name: "", image: "" }]);
  };

  const removeVariant = (index) => {
    const updatedVariants = variants.filter((_, i) => i !== index);
    setVariants(updatedVariants);
  };

  const handleVariantChange = (index, key, value) => {
    const updatedVariants = [...variants];
    updatedVariants[index][key] = value;
    setVariants(updatedVariants);
  };

  const handleImageRemove = (public_id) => {
    setLoading(true);
    axios
      .post(
        `${process.env.REACT_APP_API}/removeimage`,
        { public_id },
        {
          headers: {
            authtoken: user ? user.token : "",
          },
        }
      )
      .then((res) => {
        const updatedVariants = variants.map((variant) => {
          if (variant.image?.public_id === public_id) {
            // Clear the image field for the matching variant
            return { ...variant, image: "" };
          }
          return variant; // Keep other variants unchanged
        });
        setVariants(updatedVariants);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const addSize = () => {
    setSizes([
      ...sizes,
      {
        size: "",
        prices: [
          { type: "price", value: "" },
          { type: "disprice", value: "" },
        ],
      },
    ]);
  };

  const removeSize = (index) => {
    const updatedSizes = sizes.filter((_, i) => i !== index);
    setSizes(updatedSizes);
  };

  const handleSize = (index, key, value) => {
    const updatedSizes = [...sizes];

    if (key === "size") {
      // Update size value
      updatedSizes[index].size = value;
    } else if (key === "price" || key === "disprice") {
      // Update price value
      const priceIndex = updatedSizes[index].prices.findIndex(
        (price) => price.type === key
      );
      if (priceIndex !== -1) {
        updatedSizes[index].prices[priceIndex].value = value;
      }
    }

    setSizes(updatedSizes);
  };

  return (
    <div className="col-md-10">
      {loading ? (
        <LoadingOutlined className="text-danger h1" />
      ) : (
        <h4>Product create</h4>
      )}
      <hr />

      <div className="p-3">
        <FileUpload
          values={values}
          setValues={setValues}
          setLoading={setLoading}
        />
      </div>
      <ProductCreateForm
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        setValues={setValues}
        values={values}
        handleCatagoryChange={handleCatagoryChange}
        handleSubChange={handleSubChange}
        subOptions={subOptions}
        sub2Options={sub2Options}
        handleSub2Change={handleSub2Change}
        attributes={attributes}
        addAttribute={addAttribute}
        addDesAttribute={addDesAttribute}
        removeDesAttribute={removeDesAttribute}
        desattributes={desattributes}
        setDesattributes={setDesattributes}
        handleDesAttributeChange={handleDesAttributeChange}
        setLoading={setLoading}
        handleImageRemove={handleImageRemove}
        variants={variants}
        addVariants={addVariants}
        removeVariant={removeVariant}
        handleVariantChange={handleVariantChange}
        sizes={sizes}
        addSize={addSize}
        removeSize={removeSize}
        handleSize={handleSize}
      />
    </div>
  );
};

export default ProductCreate;
