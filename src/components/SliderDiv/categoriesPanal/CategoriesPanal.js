import React, { useState } from "react";
import classes from "./CategoriesPanal.module.css";
import { Link } from "react-router-dom";
import { ReactComponent as Applesvg } from "../../../images/headersvgs/Applesvg.svg";
import CategorylistSkull from "../../Skeletons/CategorylistSkull";
import sampleimg from "../../../images/catesample3.webp";

const CategoriesPanal = (props) => {
  const { loading, Categories } = props;
  const [subCategories, setsubCategories] = useState([]);
  const [showPanal, setshowPanal] = useState("none");

  const htmlToRender = (htmlString) => {
    return <div dangerouslySetInnerHTML={{ __html: htmlString }} />;
  };

  const handleHover = (category) => {
    setsubCategories(category.children);
    setshowPanal("flex");
  };
  const handleave = () => {
    setshowPanal("none");
  };

  return (
    <>
      <div className="categorynavcont homepagecatenav">
        <ul className="categorylist_ul">
          {loading ? (
            <CategorylistSkull></CategorylistSkull>
          ) : (
            Categories &&
            Categories.map((category) => {
              return (
                <li
                  onMouseEnter={() => handleHover(category)}
                  key={category._id}
                  onMouseLeave={handleave}
                >
                  <Link
                    to={`/category/?category=${category.slug}`}
                    className="categorylist"
                  >
                    <div className="catesvg">
                      {category.svg ? htmlToRender(category.svg) : "-"}
                    </div>
                    <p> {category.name} </p>
                  </Link>
                </li>
              );
            })
          )}
        </ul>
        <div
          onMouseEnter={() => setshowPanal("flex")}
          onMouseLeave={handleave}
          className={classes.subCatrgoriesmain}
          style={{ display: `${showPanal}` }}
        >
          <div className="subcatecont">
            {subCategories &&
              subCategories.map((category) => {
                return (
                  <div className={classes.subcategory} key={category._id}>
                    <Link className="subcatelink" to={`/shop?${category.slug}`}>
                      <img src={category.image && category.image.url} alt="" />
                      <p>{category.name}</p>
                    </Link>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
};

export default React.memo(CategoriesPanal);
