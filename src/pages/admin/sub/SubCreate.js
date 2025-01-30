import React, { useState, useEffect } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import { toast } from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { getCategories } from "../../../functions/category";
import { createSub, removeSub, getSubs } from "../../../functions/sub";
import { Link } from "react-router-dom";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import SubForm from "../../../components/forms/Subform";
import LocalSearch from "../../../components/forms/LocalSearch";
import CategoryImgupload from "../../../components/forms/CategoryImgupload";
import axios from "axios";
import Model from "../../../components/Model/Model";
import { auth } from "../../../firebase"; // Import Firebase auth

const SubCreate = () => {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [showModels, setShowModels] = useState([]);
  const [subs, setSubs] = useState([]);
  // step 1
  const [keyword, setKeyword] = useState("");

  const { user } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();

  useEffect(() => {
    loadCategories();
    loadSubs();
  }, []);

  const loadCategories = () =>
    getCategories().then((c) => setCategories(c.data));

  const loadSubs = () => getSubs().then((s) => setSubs(s.data));

  const handleModelToggle = (index) => {
    const newShowModels = [...showModels];
    newShowModels[index] = !newShowModels[index];
    setShowModels(newShowModels);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let token = user.token; // Use current token

    // Function to create sub-category
    const createSubWithToken = async (currentToken) => {
      return createSub({ name, parent: category, image }, currentToken);
    };

    try {
      const res = await createSubWithToken(token);
      setLoading(false);
      setName("");
      setImage("");
      toast.success(`"${res.data.name}" is created`);
      loadSubs();
    } catch (err) {
      setLoading(false);

      if (err.response && err.response.status === 401) {
        try {
          // Token expired, renew it
          const newToken = await auth.currentUser.getIdToken(true);

          // Update Redux store with new token
          dispatch({
            type: "LOGGED_IN_USER",
            payload: { ...user, token: newToken },
          });

          // Retry createSub with new token
          const res = await createSubWithToken(newToken);
          setName("");
          setImage("");
          toast.success(`"${res.data.name}" is created`);
          loadSubs();
        } catch (renewError) {
          console.log("Token renewal failed:", renewError);
          toast.error("Session expired. Please log in again.");
        }
      } else {
        console.log(err);
        toast.error(err.response?.data || "Something went wrong.");
      }
    }
  };

  const handleRemove = async (slug) => {
    // let answer = window.confirm("Delete?");
    // console.log(answer, slug);
    if (window.confirm("Delete?")) {
      setLoading(true);
      removeSub(slug, user.token)
        .then((res) => {
          setLoading(false);
          toast.success(`${res.data.name} deleted`);
          loadSubs();
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
        <h4>Create sub category</h4>
      )}
      <div className="p-3">
        <CategoryImgupload
          image={image}
          setImage={setImage}
          setLoading={setLoading}
          handleImageRemove={handleImageRemove}
        />
      </div>
      <div className="form-group">
        <label>Parent category</label>
        <select
          name="category"
          className="form-control"
          onChange={(e) => setCategory(e.target.value)}
        >
          <option>Please select</option>
          {categories.length > 0 &&
            categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
        </select>
      </div>
      <SubForm
        handleSubmit={handleSubmit}
        name={name}
        setName={setName}
        image={image}
      />
      {/* step 2 and step 3 */}
      <LocalSearch keyword={keyword} setKeyword={setKeyword} />
      {/* step 5 */}
      {subs.filter(searched(keyword)).map((s, index) => (
        <div className="alert alert-secondary" key={s._id}>
          {s.name} --- {s.slug}{" "}
          {s.image && (
            <span>
              -----{" "}
              <Model
                key={index}
                show={showModels[index]}
                closeModel={() => handleModelToggle(index)}
              >
                <img className="" src={s.image.url} alt="" />
              </Model>
              <img
                onClick={() => handleModelToggle(index)}
                style={{ width: "25px", height: "25px", cursor: "pointer" }}
                src={s.image.url}
                alt=""
              />
            </span>
          )}
          <span
            onClick={() => handleRemove(s.slug)}
            className="btn btn-sm float-right"
          >
            <DeleteOutlined className="text-danger" />
          </span>
          <Link to={`/admin/sub/${s.slug}`}>
            <span className="btn btn-sm float-right">
              <EditOutlined className="text-warning" />
            </span>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default SubCreate;
