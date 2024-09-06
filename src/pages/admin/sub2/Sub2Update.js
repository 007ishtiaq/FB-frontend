import React, { useState, useEffect } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { getSubs } from "../../../functions/sub";
import { updateSub2, getSub2 } from "../../../functions/sub2";
import SubForm from "../../../components/forms/Subform";
import AdminsideNavcopy from "../../../components/nav/AdminsideNavcopy";

const Sub2Update = ({ match, history }) => {
  const { user } = useSelector((state) => ({ ...state }));

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [subs, setSubs] = useState([]);
  const [parent, setParent] = useState("");

  useEffect(() => {
    loadSubs();
    loadSub2();
  }, []);

  const loadSubs = () => getSubs().then((s2) => setSubs(s2.data));

  const loadSub2 = () =>
    getSub2(match.params.slug).then((s2) => {
      setName(s2.data.sub2.name);
      setParent(s2.data.sub2.parent);
    });

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(name);
    setLoading(true);
    updateSub2(match.params.slug, { name, parent }, user.token)
      .then((res) => {
        // console.log(res)
        setLoading(false);
        setName("");
        toast.success(`"${res.data.name}" is updated`);
        history.push("/AdminPanel?page=Sub2Create");
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        if (err.response.status === 400) toast.error(err.response.data);
      });
  };

  return (
    <div class="manageacmaincont">
      <div class="manageaccont">
        <AdminsideNavcopy currentActive="Sub2Create" />
        <div class="navrightside">
          <div className="col">
            {loading ? (
              <h4 className="text-danger">Loading..</h4>
            ) : (
              <h4>Update sub category level 2</h4>
            )}

            <div className="form-group">
              <label>Parent category</label>
              <select
                name="sub"
                className="form-control"
                onChange={(e) => setParent(e.target.value)}
              >
                <option>Please select</option>
                {subs.length > 0 &&
                  subs.map((s) => (
                    <option
                      key={s._id}
                      value={s._id}
                      selected={s._id === parent}
                    >
                      {s.name} --- {s.slug}
                    </option>
                  ))}
              </select>
            </div>

            <SubForm
              handleSubmit={handleSubmit}
              name={name}
              setName={setName}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sub2Update;
