import React, { useState, useEffect } from "react";
import "./OrderEditForm.css";
import { toast } from "react-hot-toast";

export default function OrderEditForm({ form, setForm, removeItem }) {
  const { ItemName, Brand, Color, Shipping, Price, Quantity, totalqty } = form;
  const [qtyavailable, setQtyavailable] = useState(0);

  useEffect(() => {
    // fixing qtyavailable
    setQtyavailable(parseInt(Quantity) + parseInt(totalqty));
  }, []);

  let qtyofproduct = totalqty;
  let qty = Quantity;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleQtyChange = (e) => {
    if (e.target.value > qtyavailable) {
      toast.error("Quantity cannot be greater then Available stock");
    } else if (e.target.value < 1) {
      toast.error("Quantity cannot be less then 1");
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
    console.log("value", e.target.value);
  };

  return (
    <div class="shippingsubcont">
      <form className="form">
        <div class="Ordersmaincont">
          <table>
            <thead>
              <tr>
                <th class="ordli">Action</th>
                <th class="ordli">Item</th>
                <th class="ordli">Brand</th>
                <th class="ordli">Color</th>
                <th class="ordli">Shipping fee</th>
                <th class="ordli">Price</th>
                <th class="ordli">Quantity</th>
                <th class="ordli">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="ordli">
                  <div onClick={removeItem}>X</div>
                </td>
                <td class="ordli">{ItemName}</td>
                <td class="ordli">{Brand}</td>
                <td class="ordli">{Color}</td>

                <td class="ordli editli">
                  Rs.{" "}
                  {
                    <input
                      type="text"
                      placeholder="Shipping"
                      name="Shipping"
                      value={Shipping}
                      onChange={handleChange}
                    ></input>
                  }
                  .00
                </td>
                <td class="ordli editli">
                  Rs.{" "}
                  {
                    <input
                      type="text"
                      placeholder="Price"
                      name="Price"
                      value={Price}
                      onChange={handleChange}
                    ></input>
                  }
                  .00
                </td>
                <td class="ordli editli">
                  {
                    <input
                      type="number"
                      placeholder="Quantity"
                      name="Quantity"
                      value={Quantity}
                      onChange={handleQtyChange}
                    ></input>
                  }
                </td>
                <td class="ordli editli">Rs. {Price * Quantity}.00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </form>
    </div>
  );
}
