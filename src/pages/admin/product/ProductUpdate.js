import React, { useState, useEffect } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { getProductAdmin, updateProduct } from "../../../functions/product";
import { getCategories, getCategorySubs } from "../../../functions/category";
import { getSubsSub2 } from "../../../functions/sub";
import FileUpload from "../../../components/forms/FileUpload";
import { LoadingOutlined } from "@ant-design/icons";
import ProductUpdateForm from "../../../components/forms/ProductUpdateForm";
import AdminsideNavcopy from "../../../components/nav/AdminsideNavcopy";
import { getColors } from "../../../functions/color";
import axios from "axios";

const initialState = {
  art: "",
  title: "",
  description: "",
  price: "",
  disprice: "",
  shippingcharges: "",
  category: "",
  shipping: "",
  quantity: "",
  weight: "",
  images: [],
  color: "",
  size: "",
  onSale: "",
};

const ProductUpdate = ({ match, history }) => {
  // state
  const [values, setValues] = useState(initialState);
  const [categories, setCategories] = useState([]);
  const [subOptions, setSubOptions] = useState([]);
  const [sub2Options, setSub2Options] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [desattributes, setDesattributes] = useState([]);
  const [colors, setColors] = useState([]);
  const [arrayOfSubs2, setArrayOfSubs2] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  // const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [sizes, setSizes] = useState([]);
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user } = useSelector((state) => ({ ...state }));
  // router
  const { slug } = match.params;

  useEffect(() => {
    loadProduct();
    getColors().then((c) => {
      setColors(c.data.map((item) => item.name));
    });
    loadCategories();
  }, []);

  const loadProduct = () => {
    getProductAdmin(slug, user.token).then((p) => {
      // 1 load single proudct
      setValues({ ...values, ...p.data });
      setAttributes(p.data.attributes);
      setDesattributes(p.data.desattributes);
      setVariants(p.data.variants);
      setSizes(p.data.sizes);
      // 2 load single product category subs
      getCategorySubs(p.data.category._id).then((res) => {
        setSubOptions(res.data); // on first load, show default subs
      });
      // getSubsSub2(p.data.subs._id).then((res) => {
      //   setSub2Options(res.data); // on first load, show default subs
      // });

      // 3 prepare array of sub ids to show as default sub values in antd Select
      // let arr = [];
      // p.data.subs2.map((s2) => {
      //   arr.push(s2._id);
      // });
      // console.log("ERR", arr);
      // setArrayOfSubs2((prev) => arr);
      // Fetch sub2Options for each subs in attributes
      const sub2FetchPromises = p.data.attributes.map((attr) => {
        return getSubsSub2(attr.subs._id).then((res) => res.data);
      });

      // Once all promises are resolved, set the sub2 options
      Promise.all(sub2FetchPromises).then((sub2OptionsArray) => {
        const updatedAttributes = p.data.attributes.map((attr, index) => ({
          ...attr,
          sub2Options: sub2OptionsArray[index],
        }));
        setAttributes(updatedAttributes);
      });
    });
  };

  const loadCategories = () =>
    getCategories().then((c) => {
      // console.log("GET CATEGORIES IN UPDATE PRODUCT", c.data);
      setCategories(c.data);
    });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    values.category = selectedCategory ? selectedCategory : values.category;
    // values.subs = selectedSubCategory ? selectedSubCategory : values.subs;
    // values.subs2 = arrayOfSubs2;
    const payload = { ...values, attributes, desattributes, variants, sizes };
    updateProduct(slug, payload, user.token)
      .then((res) => {
        setLoading(false);
        toast.success(`"${res.data.title}" is updated`);
        history.push("/AdminPanel?page=AllProducts");
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        toast.error(err.response.data.error);
      });
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    if (e.target.name === "onSale" && e.target.value === "No")
      setValues({ ...values, onSale: "No", saleTime: "" });
  };

  const handleCategoryChange = (e) => {
    e.preventDefault();
    setAttributes([{ subs: "", subs2: [] }]);
    setSelectedCategory(e.target.value);
    getCategorySubs(e.target.value).then((res) => {
      setSubOptions(res.data);
    });
    setArrayOfSubs2([]);
  };

  // const handleCategoryChange = (e) => {
  //   e.preventDefault();
  //   const selectedCategory = e.target.value;
  //   const resetAttributes = attributes.map(() => ({
  //     subs: "",
  //     subs2: [],
  //     sub2Options: [],
  //   }));
  //   setSelectedCategory(selectedCategory);
  //   setAttributes(resetAttributes);
  //   getCategorySubs(selectedCategory).then((res) => {
  //     setSubOptions(res.data);
  //   });
  //   setArrayOfSubs2([]);
  // };

  // const handleSubChange = (index, e) => {
  //   e.preventDefault();
  //   const newAttributes = [...attributes];
  //   const selectedSub = e.target.value;
  //   newAttributes[index].subs = selectedSub;
  //   newAttributes[index].subs2 = [];
  //   setAttributes(newAttributes);
  //   getSubsSub2(selectedSub).then((res) => {
  //     setSub2Options(res.data);
  //     console.log("setSub2Options", res.data);
  //   });
  // };

  const handleSubChange = (index, e) => {
    e.preventDefault();
    const newAttributes = [...attributes];
    const selectedSub = e.target.value;

    // Update the specific sub's subs and reset subs2 and sub2Options
    newAttributes[index].subs = selectedSub;
    newAttributes[index].subs2 = [];
    newAttributes[index].sub2Options = [];

    // Fetch the new sub2 options for the selected sub
    getSubsSub2(selectedSub).then((res) => {
      // Update the specific sub's sub2Options with the fetched data
      newAttributes[index].sub2Options = res.data;
      setAttributes(newAttributes); // Set the updated attributes to state
    });
  };

  const handleSub2Change = (index, value) => {
    const newAttributes = [...attributes];
    newAttributes[index].subs2 = value.map((id) => {
      return newAttributes[index].sub2Options.find((opt) => opt._id === id);
    });
    setAttributes(newAttributes);
  };

  const addAttribute = () => {
    setAttributes([...attributes, { subs: "", subs2: [] }]);
  };

  const addDesAttribute = () => {
    setDesattributes([...desattributes, {}]);
  };

  const handleDesAttributeChange = (index, key, value) => {
    const updatedDesattributes = [...desattributes];
    updatedDesattributes[index] = { [key]: value };
    setDesattributes(updatedDesattributes);
  };

  const addVariants = () => {
    setVariants([...variants, { name: "", image: "" }]);
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
    <div class="manageacmaincont">
      <div class="manageaccont">
        <AdminsideNavcopy currentActive="AllProducts" />
        <div class="navrightside">
          <div className="col-md-10">
            {loading ? (
              <LoadingOutlined className="text-danger h1" />
            ) : (
              <h4>Product update</h4>
            )}

            {/* {JSON.stringify(values)} */}

            <div className="p-3">
              <FileUpload
                values={values}
                setValues={setValues}
                setLoading={setLoading}
              />
            </div>
            <ProductUpdateForm
              handleSubmit={handleSubmit}
              handleChange={handleChange}
              setValues={setValues}
              values={values}
              colors={colors}
              handleCategoryChange={handleCategoryChange}
              handleSubChange={handleSubChange}
              handleSub2Change={handleSub2Change}
              addAttribute={addAttribute}
              addDesAttribute={addDesAttribute}
              categories={categories}
              subOptions={subOptions}
              sub2Options={sub2Options}
              arrayOfSubs2={arrayOfSubs2}
              setArrayOfSubs2={setArrayOfSubs2}
              attributes={attributes}
              desattributes={desattributes}
              selectedCategory={selectedCategory}
              handleDesAttributeChange={handleDesAttributeChange}
              setLoading={setLoading}
              handleImageRemove={handleImageRemove}
              variants={variants}
              addVariants={addVariants}
              handleVariantChange={handleVariantChange}
              sizes={sizes}
              addSize={addSize}
              handleSize={handleSize}
            />
            <hr />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductUpdate;
