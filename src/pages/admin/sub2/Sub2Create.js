import React, { useState, useEffect } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { getSubs } from "../../../functions/sub";
import { createSub2, removeSub2, getSubs2 } from "../../../functions/sub2";
import { Link } from "react-router-dom";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import SubForm from "../../../components/forms/Subform";
import LocalSearch from "../../../components/forms/LocalSearch";

const Sub2Create = () => {
  const { user } = useSelector((state) => ({ ...state }));

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  // const [categories, setCategories] = useState([]);
  const [sub, setSub] = useState("");
  const [subs, setSubs] = useState([]);
  const [subs2, setSubs2] = useState([]);
  // step 1
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    loadSubs();
    loadSubs2();
    // loadCategories();
  }, []);

  const loadSubs = () => getSubs().then((s) => setSubs(s.data));

  const loadSubs2 = () => getSubs2().then((s2) => setSubs2(s2.data));

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(name);
    setLoading(true);
    createSub2({ name, parent: sub }, user.token)
      .then((res) => {
        // console.log(res)
        setLoading(false);
        setName("");
        toast.success(`"${res.data.name}" is created`);
        loadSubs2();
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
      removeSub2(slug, user.token)
        .then((res) => {
          setLoading(false);
          toast.success(`${res.data.name} deleted`);
          loadSubs2();
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
        <h4>Create sub category level 2</h4>
      )}

      <div className="form-group">
        <label>Parent sub category</label>
        <select
          name="sub"
          className="form-control"
          onChange={(e) => setSub(e.target.value)}
        >
          <option>Please select</option>
          {subs.length > 0 &&
            subs.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name} --- {s.slug}
              </option>
            ))}
        </select>
      </div>

      <SubForm handleSubmit={handleSubmit} name={name} setName={setName} />

      {/* step 2 and step 3 */}
      <LocalSearch keyword={keyword} setKeyword={setKeyword} />

      {/* step 5 */}
      {subs2.filter(searched(keyword)).map((s2) => (
        <div className="alert alert-secondary" key={s2._id}>
          {s2.name} --- {s2.slug}
          <span
            onClick={() => handleRemove(s2.slug)}
            className="btn btn-sm float-right"
          >
            <DeleteOutlined className="text-danger" />
          </span>
          <Link to={`/admin/sub2/${s2.slug}`}>
            <span className="btn btn-sm float-right">
              <EditOutlined className="text-warning" />
            </span>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Sub2Create;
