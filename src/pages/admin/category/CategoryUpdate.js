import React, { useState, useEffect } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { getCategory, updateCategory } from "../../../functions/category";
import CategoryForm from "../../../components/forms/CategoryForm";
import CategoryImgupload from "../../../components/forms/CategoryImgupload";
import axios from "axios";
import AdminsideNavcopy from "../../../components/nav/AdminsideNavcopy";

const CategoryUpdate = ({ history, match }) => {
  const { user } = useSelector((state) => ({ ...state }));

  const [name, setName] = useState("");
  const [svg, setSvg] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCategory();
  }, []);

  const loadCategory = () =>
    getCategory(match.params.slug).then((c) => {
      setName(c.data.category.name);
      setSvg(c.data.category.svg);
      setImage(c.data.category.image);
    });

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(name);
    setLoading(true);
    updateCategory(match.params.slug, { name, svg, image }, user.token)
      .then((res) => {
        // console.log(res)
        setLoading(false);
        setName("");
        setSvg("");
        setImage("");
        toast.success(`"${res.data.name}" is updated`);
        history.push("/AdminPanel?page=CategoryCreate");
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
        <AdminsideNavcopy currentActive="CategoryCreate" />
        <div class="navrightside">
          <div className="col">
            {loading ? (
              <h4 className="text-danger">Loading..</h4>
            ) : (
              <h4>Update category</h4>
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

            <hr />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryUpdate;
