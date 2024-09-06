import React from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { ReactComponent as Searchsvg } from "../../images/headersvgs/formsvgs/Searchsvg.svg";

const Search = () => {
  const dispatch = useDispatch();
  const { search } = useSelector((state) => ({ ...state }));
  const { text } = search;

  const history = useHistory();

  const handleChange = (e) => {
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: e.target.value },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    history.push(`/shop?${text}`);
  };

  return (
    <form class="search-form searchformhidediv" onSubmit={handleSubmit}>
      <div class="rightside">
        <div className="searchsvg">
          <Searchsvg />
        </div>
        <div class="inputdiv">
          <input
            id="search-input"
            name="search-input"
            onChange={handleChange}
            class="searchinput"
            type="search"
            value={text}
          />
        </div>
      </div>
      <div class="leftside">
        <button onClick={handleSubmit} class="searchbtn">
          Search
        </button>
      </div>
    </form>
  );
};

export default Search;
