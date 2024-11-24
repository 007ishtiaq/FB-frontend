import React from "react";
import "./productdesc.css";

export default function ProductDescription({ product }) {
  // const { description, desattributes } = product;
  const htmlToRender = (htmlString) => {
    return (
      <div className="" dangerouslySetInnerHTML={{ __html: htmlString }} />
    );
  };
  return (
    <div class="prodowncont">
      <div class="prodownsub">
        <div class="headingcont">Product Description</div>
        <hr />
        <div class="desccontent">
          <div class="desccontentleft">
            {/* <table class="table table2nd tabledesattri">
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
            </table> */}
            <ul>
              {product.desattributes && (
                <table
                  border="1"
                  cellPadding="10"
                  cellSpacing="0"
                  style={{
                    borderColor: "#0000003b",
                    borderCollapse: "collapse",
                    width: "100%",
                  }}
                >
                  <thead>
                    <tr>
                      {/* Use colSpan to make the "Specifications" header span both columns */}
                      <th
                        colSpan="2"
                        style={{ padding: "0.5rem", textAlign: "center" }}
                      >
                        Specifications
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.desattributes.map((item, index) => (
                      <tr key={index}>
                        <td className="li_head">{Object.keys(item)[0]}</td>
                        <td className="li_sub">{Object.values(item)[0]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </ul>
          </div>
          <div class="desccontentright">
            <strong>About this item: </strong>
            <br />
            <p className="prodhtml">{htmlToRender(product.description)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
