import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { createProduct } from "../../../functions/product";
import ProductCreateForm from "../../../components/forms/ProductCreateForm";
import { getCategories, getCategorySubs } from "../../../functions/category";
import { getSubsSub2 } from "../../../functions/sub";
import FileUpload from "../../../components/forms/FileUpload";
import { LoadingOutlined } from "@ant-design/icons";
import { getBrands } from "../../../functions/brands";
import { getColors } from "../../../functions/color";

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
  brands: [],
  color: "White",
  brand: "Apple",
  onSale: "No",
  saleTime: "",
};

const ProductCreate = () => {
  const [values, setValues] = useState(initialState);
  const [subOptions, setSubOptions] = useState([]);
  const [sub2Options, setSub2Options] = useState([]);
  const [attributes, setAttributes] = useState([{ subs: "", subs2: [] }]);
  const [desattributes, setDesattributes] = useState([{}]);
  const [loading, setLoading] = useState(false);

  // redux
  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    const fetchData = async () => {
      await loadCategories();

      const colorsData = await getColors();
      setValues((prevValues) => ({
        ...prevValues,
        colors: colorsData.data.map((item) => item.name),
      }));

      const brandsData = await getBrands();
      setValues((prevValues) => ({
        ...prevValues,
        brands: brandsData.data.map((item) => item.name),
      }));
    };

    fetchData();
  }, []);

  const loadCategories = () =>
    getCategories().then((c) => setValues({ ...values, categories: c.data }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...values, attributes, desattributes };
    createProduct(payload, user.token)
      .then((res) => {
        window.alert(`"${res.data.title}" is created`);
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.error);
      });
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

  const handleDesAttributeChange = (index, key, value) => {
    const updatedDesattributes = [...desattributes];
    updatedDesattributes[index] = { [key]: value };
    setDesattributes(updatedDesattributes);
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
        desattributes={desattributes}
        setDesattributes={setDesattributes}
        handleDesAttributeChange={handleDesAttributeChange}
      />
    </div>
  );
};

export default ProductCreate;
