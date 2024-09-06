import React from "react";
import "./productdesc.css";

export default function ProductDescription() {
  return (
    <div class="prodowncont">
      <div class="prodownsub">
        <div class="headingcont">Description</div>
        <hr />
        <div class="desccontent">
          <div class="desccontentleft">
            <table class="table table2nd">
              <thead>
                <tr>
                  <th>Size:</th>
                  <th>Fabric Material:</th>
                  <th>Suitable Type:</th>
                  <th>Thickness:</th>
                  <th>Colour:</th>
                  <th>Occasion:</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>ABC</td>
                  <td>Jell</td>
                  <td>All</td>
                  <td>Mint</td>
                  <td>Adult</td>
                  <td>Leisure</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="desccontentright">
            <strong>Product Description: </strong>
            <br />
            <span> Men's Summer Print Short Sleeve Shirt </span>
          </div>
        </div>
      </div>
    </div>
  );
}
