import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import "./CategoryCreate.css";
import { useSelector } from "react-redux";
import {
  createCategory,
  getCategories,
  removeCategory,
} from "../../../functions/category";
import { Link } from "react-router-dom";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import CategoryForm from "../../../components/forms/CategoryForm";
import LocalSearch from "../../../components/forms/LocalSearch";
import CategoryImgupload from "../../../components/forms/CategoryImgupload";
import axios from "axios";
import Model from "../../../components/Model/Model";

const CategoryCreate = () => {
  const { user } = useSelector((state) => ({ ...state }));

  const [name, setName] = useState("");
  const [svg, setSvg] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
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
    loadCategories();
  }, []);

  const loadCategories = () =>
    getCategories().then((c) => {
      setCategories(c.data);
      setShowModels(Array(c.data.length).fill(false));
    });

  const handleModelToggle = (index) => {
    const newShowModels = [...showModels];
    newShowModels[index] = !newShowModels[index];
    setShowModels(newShowModels);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(name);
    setLoading(true);
    createCategory({ name, svg, image }, user.token)
      .then((res) => {
        // console.log(res)
        setLoading(false);
        setName("");
        setSvg("");
        setImage("");
        toast.success(`"${res.data.name}" is created`);
        loadCategories();
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
      removeCategory(slug, user.token)
        .then((res) => {
          handleImageRemove(public_id);
          setLoading(false);
          toast.success(`${res.data.name} deleted`);
          loadCategories();
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
        <h4>Create category</h4>
      )}
      <div className="p-3">
        <CategoryImgupload
          image={image}
          setImage={setImage}
          setLoading={setLoading}
          handleImageRemove={handleImageRemove}
        />
      </div>
      <CategoryForm
        handleSubmit={handleSubmit}
        name={name}
        setName={setName}
        svg={svg}
        setSvg={setSvg}
        image={image}
      />

      {/* step 2 and step 3 */}
      <LocalSearch keyword={keyword} setKeyword={setKeyword} />

      {/* step 5 */}
      {categories.filter(searched(keyword)).map((c, index) => (
        <div className="alert alert-secondary" key={c._id}>
          <span>{htmlToRender(c.svg)} ----- </span>
          <span> {c.name} </span>
          {c.image && (
            <span>
              -----{" "}
              <Model
                key={index}
                show={showModels[index]}
                closeModel={() => handleModelToggle(index)}
              >
                <img className="" src={c.image.url} alt="" />
              </Model>
              <img
                onClick={() => handleModelToggle(index)}
                style={{ width: "25px", height: "25px", cursor: "pointer" }}
                src={c.image.url}
                alt=""
              />
            </span>
          )}
          <span
            onClick={() => handleRemove(c.slug, c.image.public_id)}
            className="btn btn-sm float-right"
          >
            <DeleteOutlined className="text-danger" />
          </span>
          <Link to={`/admin/category/${c.slug}`}>
            <span className="btn btn-sm float-right">
              <EditOutlined className="text-warning" />
            </span>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default CategoryCreate;
