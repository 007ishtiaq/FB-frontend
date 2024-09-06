import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { createBrand, getBrands, removeBrand } from "../../../functions/brands";
import { Link } from "react-router-dom";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import BrandForm from "../../../components/forms/BrandForm";
import LocalSearch from "../../../components/forms/LocalSearch";
import axios from "axios";
import CategoryImgupload from "../../../components/forms/CategoryImgupload";
import Model from "../../../components/Model/Model";

const BrandCreate = () => {
  const { user } = useSelector((state) => ({ ...state }));

  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [svg, setSvg] = useState("");
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState([]);
  const [showModels, setShowModels] = useState([]);

  const htmlToRender = (htmlString) => {
    return (
      <div
        className="smallsvgpreview"
        dangerouslySetInnerHTML={{ __html: htmlString }}
      />
    );
  };

  // step 1
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = () =>
    getBrands().then((b) => {
      setBrands(b.data);
      setShowModels(Array(b.data.length).fill(false));
    });

  const handleModelToggle = (index) => {
    const newShowModels = [...showModels];
    newShowModels[index] = !newShowModels[index];
    setShowModels(newShowModels);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    createBrand({ name, svg, image }, user.token)
      .then((res) => {
        // console.log(res)
        setLoading(false);
        setName("");
        setImage("");
        setSvg("");
        toast.success(`"${res.data.name}" is created`);
        loadBrands();
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        if (err.response.status === 400) toast.error(err.response.data);
      });
  };

  const handleRemove = async (slug, public_id) => {
    // let answer = window.confirm("Delete?");
    // console.log(answer, slug);
    if (window.confirm("Delete?")) {
      setLoading(true);
      removeBrand(slug, user.token)
        .then((res) => {
          handleImageRemove(public_id);
          setLoading(false);
          toast.success(`${res.data.name} deleted`);
          loadBrands();
        })
        .catch((err) => {
          if (err.response.status === 400) {
            setLoading(false);
            toast.error(err.response.data);
          }
        });
    }
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
        setLoading(false);
        setImage("");
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  // step 4
  const searched = (keyword) => (c) => c.name.toLowerCase().includes(keyword);

  return (
    <div className="col">
      {loading ? (
        <h4 className="text-danger">Loading..</h4>
      ) : (
        <h4>Create Brand</h4>
      )}
      <div className="p-3">
        <CategoryImgupload
          image={image}
          setImage={setImage}
          setLoading={setLoading}
          handleImageRemove={handleImageRemove}
        />
      </div>

      <BrandForm
        handleSubmit={handleSubmit}
        name={name}
        setName={setName}
        image={image}
        svg={svg}
        setSvg={setSvg}
      />
      {/* step 2 and step 3 */}
      <LocalSearch keyword={keyword} setKeyword={setKeyword} />
      {/* step 5 */}
      {brands.filter(searched(keyword)).map((b, index) => (
        <div className="alert alert-secondary" key={b._id}>
          <span>{htmlToRender(b.svg)} ----- </span>
          <span> {b.name} </span>
          {b.image && (
            <span>
              -----{" "}
              <Model
                key={index}
                show={showModels[index]}
                closeModel={() => handleModelToggle(index)}
              >
                <img className="" src={b.image.url} alt="" />
              </Model>
              <img
                onClick={() => handleModelToggle(index)}
                style={{ width: "25px", height: "25px", cursor: "pointer" }}
                src={b.image.url}
                alt=""
              />
            </span>
          )}
          <span
            onClick={() => handleRemove(b.slug, b.image.public_id)}
            className="btn btn-sm float-right"
          >
            <DeleteOutlined className="text-danger" />
          </span>
          <Link to={`/admin/brand/${b.slug}`}>
            <span className="btn btn-sm float-right">
              <EditOutlined className="text-warning" />
            </span>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default BrandCreate;
