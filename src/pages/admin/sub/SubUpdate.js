import React, { useState, useEffect } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { getCategories } from "../../../functions/category";
import { updateSub, getSub } from "../../../functions/sub";
import SubForm from "../../../components/forms/Subform";
import AdminsideNavcopy from "../../../components/nav/AdminsideNavcopy";
import CategoryImgupload from "../../../components/forms/CategoryImgupload";
import axios from "axios";

const SubUpdate = ({ match, history }) => {
  const { user } = useSelector((state) => ({ ...state }));

  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [parent, setParent] = useState("");

  useEffect(() => {
    loadCategories();
    loadSub();
  }, []);

  const loadCategories = () =>
    getCategories().then((c) => setCategories(c.data));

  const loadSub = () =>
    getSub(match.params.slug).then((s) => {
      setName(s.data.sub.name);
      setParent(s.data.sub.parent);
      setImage(s.data.sub.image);
    });

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(name);
    setLoading(true);
    updateSub(match.params.slug, { name, parent, image }, user.token)
      .then((res) => {
        // console.log(res)
        setLoading(false);
        setName("");
        setImage("");
        toast.success(`"${res.data.name}" is updated`);
        history.push("/AdminPanel?page=SubCreate");
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        if (err.response.status === 400) toast.error(err.response.data);
      });
  };

  const handleImageRemove = (public_id) => {
    setLoading(true);
    // console.log("remove image", public_id);
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

  return (
    <div class="manageacmaincont">
      <div class="manageaccont">
        <AdminsideNavcopy currentActive="SubCreate" />
        <div class="navrightside">
          <div className="col">
            {loading ? (
              <h4 className="text-danger">Loading..</h4>
            ) : (
              <h4>Update sub category</h4>
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
                onChange={(e) => setParent(e.target.value)}
              >
                <option>Please select</option>
                {categories.length > 0 &&
                  categories.map((c) => (
                    <option
                      key={c._id}
                      value={c._id}
                      selected={c._id === parent}
                    >
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubUpdate;
