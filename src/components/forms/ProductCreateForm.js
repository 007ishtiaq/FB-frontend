import React from "react";
import { Select } from "antd";
import CategoryImgupload from "./CategoryImgupload";

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
  removeDesAttribute,
  desattributes,
  handleDesAttributeChange,
  setLoading,
  handleImageRemove,
  variants,
  addVariants,
  removeVariant,
  handleVariantChange,
  sizes,
  addSize,
  removeSize,
  handleSize,
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
    color,
    size,
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
        const currentKey = Object.keys(desattr)[0] || "";
        const currentValue = Object.values(desattr)[0] || "";

        return (
          <div key={index} className="form-group">
            <div>
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

            {/* Remove Button */}
            <button
              type="button"
              className="btn btn-danger ms-2"
              onClick={() => removeDesAttribute(index)}
            >
              Remove
            </button>
          </div>
        );
      })}

      <button
        type="button"
        className="btn btn-outline-secondary mt-2"
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
        <label>Selected Color (Required)</label>
        <select name="color" className="form-control" onChange={handleChange}>
          <option>Please select</option>
          {colors.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {variants.map((variant, index) => (
        <div key={index} className="form-group">
          <div>
            <label>Color Variant Name</label>
            <select
              name="colorname"
              className="form-control"
              value={variant.name}
              onChange={(e) =>
                handleVariantChange(index, "name", e.target.value)
              }
            >
              <option value="">Please select</option>
              {colors.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <label>Color Variant Image</label>
            <CategoryImgupload
              image={variant.image}
              setImage={(image) => handleVariantChange(index, "image", image)}
              setLoading={setLoading}
              handleImageRemove={handleImageRemove}
            />
          </div>

          {/* Remove Button */}
          <button
            type="button"
            className="btn btn-danger ms-2"
            onClick={() => removeVariant(index)}
          >
            Remove
          </button>
        </div>
      ))}

      <button
        type="button"
        className="btn btn-outline-secondary mt-2"
        onClick={addVariants}
      >
        Add Variant
      </button>

      <div className="form-group">
        <label>Selected Size (Required)</label>
        <input
          type="text"
          name="size"
          className="form-control"
          value={size}
          onChange={handleChange}
        />
      </div>

      {sizes.map((sizeObj, index) => (
        <div key={index} className="form-group">
          <div>
            {/* Size Input */}
            <label>Size</label>
            <input
              type="text"
              className="form-control"
              value={sizeObj.size}
              onChange={(e) => handleSize(index, "size", e.target.value)}
            />

            {/* Price Input */}
            <label>Price</label>
            <input
              type="text"
              className="form-control"
              value={sizeObj.prices[0].value}
              onChange={(e) => handleSize(index, "price", e.target.value)}
            />

            {/* Discounted Price Input */}
            <label>Discounted Price</label>
            <input
              type="text"
              className="form-control"
              value={sizeObj.prices[1].value}
              onChange={(e) => handleSize(index, "disprice", e.target.value)}
            />
          </div>

          {/* Remove Button */}
          <button
            type="button"
            className="btn btn-danger ms-2"
            onClick={() => removeSize(index)}
          >
            Remove
          </button>
        </div>
      ))}

      <button
        type="button"
        className="btn btn-outline-secondary mt-2"
        onClick={addSize}
      >
        Add Size Variant
      </button>

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
