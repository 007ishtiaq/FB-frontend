import React from "react";
import { Select } from "antd";

const { Option } = Select;

const ProductCreateForm = ({
  handleSubmit,
  handleChange,
  values,
  handleCatagoryChange,
  handleSubChange,
  subOptions,
  sub2Options,
  handleSub2Change,
  attributes,
  addAttribute,
  addDesAttribute,
  desattributes,
  handleDesAttributeChange,
}) => {
  const {
    art,
    title,
    description,
    price,
    disprice,
    shippingcharges,
    categories,
    category,
    quantity,
    weight,
    images,
    colors,
    brands,
    color,
    brand,
    onSale,
    saleTime,
  } = values;

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Article Number (Required) </label>
        <input
          type="number"
          className="form-control"
          name="art"
          value={art}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label>Title (Required) </label>
        <input
          type="text"
          className="form-control"
          name="title"
          value={title}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Description</label>
        <input
          type="text"
          name="description"
          className="form-control"
          value={description}
          onChange={handleChange}
        />
      </div>

      {desattributes.map((desattr, index) => {
        // Get the current key and value from the object
        const currentKey = Object.keys(desattr)[0] || "";
        const currentValue = Object.values(desattr)[0] || "";

        return (
          <div key={index} className="form-group">
            <label>Key</label>
            <input
              type="text"
              className="form-control"
              value={currentKey}
              onChange={(e) =>
                handleDesAttributeChange(index, e.target.value, currentValue)
              }
            />

            <label>Value</label>
            <input
              type="text"
              className="form-control"
              value={currentValue}
              onChange={(e) =>
                handleDesAttributeChange(index, currentKey, e.target.value)
              }
            />
          </div>
        );
      })}

      <button
        type="button"
        className="btn btn-outline-secondary"
        onClick={addDesAttribute}
      >
        Add Description Attribute
      </button>

      <div className="form-group">
        <label>Price [ 1 or ~] (required) </label>
        <input
          type="number"
          name="price"
          className="form-control"
          value={price}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label>
          Discount Price [0 or ~] (required for FLASH or FREE ) (optional for
          COMMON)
        </label>
        <input
          type="number"
          name="disprice"
          className="form-control"
          value={disprice}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label>
          Shipping Cahrges (shipping level 1) [0 for free item] (optional)
        </label>
        <input
          type="number"
          name="shippingcharges"
          className="form-control"
          value={shippingcharges}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Weight (shipping level 2) (Required for shipping)</label>
        <input
          type="number"
          name="weight"
          className="form-control"
          value={weight}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Quantity (for flashsale scarcity)</label>
        <input
          type="number"
          name="quantity"
          className="form-control"
          value={quantity}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Color (Required)</label>
        <select name="color" className="form-control" onChange={handleChange}>
          <option>Please select</option>
          {colors.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Brand (Required) [Should be the Same for similer/color]</label>
        <select name="brand" className="form-control" onChange={handleChange}>
          <option>Please select</option>
          {brands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Category (Required)</label>
        <select
          name="category"
          className="form-control"
          onChange={handleCatagoryChange}
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

      {category &&
        attributes.map((attr, index) => (
          <div key={index}>
            <div className="form-group">
              <label>Sub Level 1</label>
              <select
                name="sub"
                className="form-control"
                onChange={(e) => handleSubChange(index, e)}
                value={attr.subs}
              >
                <option>Please select</option>
                {subOptions.length > 0 &&
                  subOptions.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name}
                    </option>
                  ))}
              </select>
            </div>

            {attr.subs && (
              <div className="form-group">
                <label>Sub Level 2</label>
                <Select
                  mode="multiple"
                  style={{ width: "100%" }}
                  placeholder="Please select"
                  value={attr.subs2}
                  onChange={(value) => handleSub2Change(index, value)}
                >
                  {sub2Options.length > 0 &&
                    sub2Options.map((s2) => (
                      <Option key={s2._id} value={s2._id}>
                        {s2.name}
                      </Option>
                    ))}
                </Select>
              </div>
            )}
          </div>
        ))}

      {category && (
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={addAttribute}
        >
          Add Attribute
        </button>
      )}

      <div className="form-group">
        <label>On Sale ? (if onsale or FREE item then Required)</label>
        <select name="onSale" className="form-control" onChange={handleChange}>
          <option>Please select</option>
          <option value="No">No</option>
          <option value="Yes">Yes</option>
        </select>
      </div>

      {values.onSale === "Yes" && (
        <div className="form-group">
          <label>Sale Time & Date (Exp: 08:26 am 13 sep 2024) </label>
          <input
            type="text"
            name="saleTime"
            className="form-control"
            value={saleTime}
            onChange={handleChange}
          />
        </div>
      )}

      <br />
      <button
        disabled={(values.onSale === "Yes" && !saleTime) || !images.length}
        className="btn btn-outline-info"
      >
        Save
      </button>
    </form>
  );
};

export default ProductCreateForm;
