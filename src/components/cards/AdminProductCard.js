import React from "react";
import { Card } from "antd";
import laptop from "../../images/laptop.png";
import { Link } from "react-router-dom";
import { ReactComponent as Editsvg } from "../../images/edit.svg";
import { ReactComponent as Deletesvg } from "../../images/delete.svg";

const { Meta } = Card;

const AdminProductCard = ({ product, handleRemove }) => {
  // destructure
  const { title, description, images, slug } = product;

  return (
    <Card
      cover={
        <img
          src={images && images.length ? images[0].url : laptop}
          style={{ height: "150px", objectFit: "cover" }}
          className="p-1"
        />
      }
      actions={[
        <Link to={`/admin/product/${slug}`}>
          <div className="smallsvgbtncont">
            <Editsvg className="smallsvgbtn" />
          </div>
        </Link>,
        <div className="smallsvgbtncont">
          <Deletesvg
            onClick={() => handleRemove(slug)}
            className="smallsvgbtn"
          />
        </div>,
      ]}
    >
      <Meta
        title={title}
        description={`${description && description.substring(0, 40)}...`}
      />
    </Card>
  );
};

export default AdminProductCard;
