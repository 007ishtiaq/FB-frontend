import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { createColor, getColors, removeColor } from "../../../functions/color";
import { DeleteOutlined } from "@ant-design/icons";
import LocalSearch from "../../../components/forms/LocalSearch";

const ColorCreate = () => {
  const { user } = useSelector((state) => ({ ...state }));

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [Colors, setColors] = useState([]);
  // step 1
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    loadColors();
  }, []);

  const loadColors = () => getColors().then((c) => setColors(c.data));

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    createColor({ name }, user.token)
      .then((res) => {
        // console.log(res)
        setLoading(false);
        setName("");
        toast.success(`"${res.data.name}" is created`);
        loadColors();
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        if (err.response.status === 400) toast.error(err.response.data);
      });
  };

  const handleRemove = async (slug) => {
    // let answer = window.confirm("Delete?");
    // console.log(answer, slug);
    if (window.confirm("Delete?")) {
      setLoading(true);
      removeColor(slug, user.token)
        .then((res) => {
          setLoading(false);
          toast.success(`${res.data.name} deleted`);
          loadColors();
        })
        .catch((err) => {
          if (err.response.status === 400) {
            setLoading(false);
            toast.error(err.response.data);
          }
        });
    }
  };

  // step 4
  const searched = (keyword) => (c) => c.name.toLowerCase().includes(keyword);

  return (
    <div className="col">
      {loading ? (
        <h4 className="text-danger">Loading..</h4>
      ) : (
        <h4>Create Color</h4>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            className="form-control"
            onChange={(e) => setName(e.target.value)}
            value={name}
            autoFocus
            required
          />
          <button className="btn btn-outline-primary">Save</button>
        </div>
      </form>

      {/* step 2 and step 3 */}
      <LocalSearch keyword={keyword} setKeyword={setKeyword} />

      {/* step 5 */}
      {Colors.filter(searched(keyword)).map((c) => (
        <div className="alert alert-secondary" key={c._id}>
          {c.name}
          <span
            onClick={() => handleRemove(c.slug)}
            className="btn btn-sm float-right"
          >
            <DeleteOutlined className="text-danger" />
          </span>
        </div>
      ))}
    </div>
  );
};

export default ColorCreate;
