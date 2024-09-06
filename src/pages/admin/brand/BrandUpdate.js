import React, { useState, useEffect } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { getBrand, updateBrand } from "../../../functions/brands";
import BrandForm from "../../../components/forms/BrandForm";
import CategoryImgupload from "../../../components/forms/CategoryImgupload";
import axios from "axios";
import AdminsideNavcopy from "../../../components/nav/AdminsideNavcopy";

const BrandUpdate = ({ history, match }) => {
  const { user } = useSelector((state) => ({ ...state }));

  const [name, setName] = useState("");
  const [svg, setSvg] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadBrand();
  }, []);

  const loadBrand = () =>
    getBrand(match.params.slug).then((b) => {
      console.log(b);
      setName(b.data.brand.name);
      setSvg(b.data.brand.svg);
      setImage(b.data.brand.image);
    });

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(name);
    setLoading(true);
    updateBrand(match.params.slug, { name, svg, image }, user.token)
      .then((res) => {
        // console.log(res)
        setLoading(false);
        setName("");
        setSvg("");
        setImage("");
        toast.success(`"${res.data.name}" is updated`);
        history.push("/AdminPanel?page=BrandCreate");
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
        <AdminsideNavcopy currentActive="BrandCreate" />
        <div class="navrightside">
          <div className="col">
            {loading ? (
              <h4 className="text-danger">Loading..</h4>
            ) : (
              <h4>Update Brand</h4>
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
            <hr />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandUpdate;
