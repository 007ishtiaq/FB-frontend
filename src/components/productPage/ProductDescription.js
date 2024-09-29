import React from "react";
import "./productdesc.css";

export default function ProductDescription({ product }) {
  // const { description, desattributes } = product;

  return (
    <div class="prodowncont">
      <div class="prodownsub">
        <div class="headingcont">Product Description</div>
        <hr />
        <div class="desccontent">
          <div class="desccontentleft">
            <table class="table table2nd tabledesattri">
              <thead>
                <tr>
                  {product.desattributes &&
                    product.desattributes.map((desattr, index) => (
                      <th key={index}>{Object.keys(desattr)[0]}:</th> // Render the key as the table header
                    ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {product.desattributes &&
                    product.desattributes.map((desattr, index) => (
                      <td key={index}>{Object.values(desattr)[0]}</td> // Render the value as table data
                    ))}
                </tr>
              </tbody>
            </table>
          </div>
          <div class="desccontentright">
            <strong>About this item: </strong>
            <br />
            <p className="">{`${product.description}`}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
