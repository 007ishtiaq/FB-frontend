import React from "react";
import { Document, Page, Text, StyleSheet, Image } from "@react-pdf/renderer";
import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  DataTableCell,
} from "@david.kucsai/react-pdf-table";
import LogoSvg from "../../images/headersvgs/invoiceLogo.png";

const Invoice = ({ order, email }) => (
  <Document>
    <Page style={styles.body}>
      <Text style={styles.header} fixed>
        Print Date: {new Date().toLocaleString()}
      </Text>

      <Text style={styles.logoimgcont}>
        <Image src={LogoSvg} style={styles.logoImage} />
      </Text>
      <Text style={styles.logosub1}>Phone: 0300-1234567</Text>
      <Text style={styles.logosub2}>Email: Billing@Pearlytouch.com</Text>

      <Text style={styles.customerinfohead}>Bill To</Text>

      <Text style={styles.customerinfosub}>
        Name: {order && order.shippingto.Name}
      </Text>
      <Text style={styles.customerinfosub}>
        Contact: {order && order.shippingto.Contact}
      </Text>
      <Text style={styles.customerinfosub}>Email: {email}</Text>
      <Text style={styles.customerinfosublast}>
        Address: {order && order.shippingto.Address},{"\n"}
        {"   "}
        {order && order.shippingto.Province},{"\n"}
        {"   "}
        {order && order.shippingto.Area},{"\n"}
        {"   "}
        {order && order.shippingto.LandMark}, {"\n"}
        {"   "}
        {order && order.shippingto.City}.
      </Text>

      <Table>
        <TableHeader>
          <TableCell style={styles.headerCell1}>Description</TableCell>
          <TableCell style={styles.headerCell2}>Quantity</TableCell>
          <TableCell style={styles.headerCell3}>Price</TableCell>
          <TableCell style={styles.headerCell4}>Amount</TableCell>
        </TableHeader>
      </Table>

      <Table data={order.products}>
        <TableBody>
          <DataTableCell
            getContent={(x) =>
              `${x.product.title} - Brand: ${x.product.brand} - Color: ${x.color}`
            }
            style={styles.tableCell1}
          />
          <DataTableCell
            getContent={(x) => x.count}
            style={styles.tableCell2}
          />
          <DataTableCell
            getContent={(x) => `${x.price}`}
            style={styles.tableCell3}
          />
          <DataTableCell
            getContent={(x) => `${x.price * x.count}`}
            style={styles.tableCell4}
          />
        </TableBody>
      </Table>
      <Table>
        <TableHeader>
          <TableCell style={styles.tableCell1}>
            {order &&
            order.paymentIntent &&
            order.paymentIntent.dispercent != null
              ? `Discount (${
                  order.paymentIntent.discountType === "Discount"
                    ? `${order.paymentIntent.dispercent}%`
                    : ""
                }${
                  order.paymentIntent.discountType === "Cash"
                    ? `$${order.paymentIntent.dispercent}`
                    : ""
                }${
                  order.paymentIntent.discountType === "Shipping"
                    ? `Shipping`
                    : ""
                } Off coupon used)`
              : " "}
          </TableCell>
          <TableCell style={styles.tableCell2}></TableCell>
          <TableCell style={styles.tableCell3}></TableCell>
          <TableCell style={styles.tableCell4}>
            {order && order.paymentIntent && order.paymentIntent.discounted
              ? `(${order.paymentIntent.discounted})`
              : " "}
          </TableCell>
        </TableHeader>
      </Table>

      <Table>
        <TableHeader>
          <TableCell style={styles.tableCell1}>Shipping Charges</TableCell>
          <TableCell style={styles.tableCell2}></TableCell>
          <TableCell style={styles.tableCell3}></TableCell>
          <TableCell style={styles.tableCell4}>
            {order && order.shippingfee}
          </TableCell>
        </TableHeader>
      </Table>

      <Table>
        <TableHeader>
          <TableCell style={styles.footerCell1}>Total Amount</TableCell>
          <TableCell style={styles.footerCell2}></TableCell>
          <TableCell style={styles.footerCell3}></TableCell>
          <TableCell style={styles.footerCell4}>
            {order && `$ ${order.paymentIntent.amount}.00`}
          </TableCell>
        </TableHeader>
      </Table>

      <Text style={styles.orderinfohead}>Order Information</Text>
      <Text style={styles.orderinfosub}>
        Order ID: {order && order.OrderId}
      </Text>
      <Text style={styles.orderinfosub}>
        Placed On: {order && new Date(order.createdAt).toLocaleString()}
      </Text>
      <Text style={styles.orderinfosub}>
        Order Status: {order && order.orderStatus}
      </Text>
      <Text style={styles.orderinfosub}>
        Mode of Payment: {order && order.paymentStatus}
      </Text>
      <Text style={styles.orderinfosub}>
        Payment Status: {order && order.isPaid ? "Paid" : "Unpaid"}
      </Text>

      <Text style={styles.footer}> Thank you for shopping with us </Text>
    </Page>
  </Document>
);

const styles = StyleSheet.create({
  body: {
    paddingTop: 15,
    paddingBottom: 35,
    paddingHorizontal: 35,
  },
  logoimgcont: {
    margin: 0,
    padding: 0,
  },
  logoImage: {
    width: 200,
    height: 40,
  },
  logosub1: {
    fontSize: 10,
    textAlign: "left",
    color: "#3a4553",
    marginLeft: 35,
    marginTop: 0,
  },
  logosub2: {
    fontSize: 10,
    textAlign: "left",
    color: "#3a4553",
    marginLeft: 35,
    marginTop: 0,
    marginBottom: 20,
  },
  customerinfohead: {
    fontSize: 11,
    textAlign: "left",
    color: "white",
    backgroundColor: "#787878",
    width: 200,
    padding: 2,
  },
  customerinfosub: {
    fontSize: 10,
    textAlign: "left",
    color: "#3a4553",
    marginLeft: 5,
    paddingTop: 1,
    width: 200,
    paddingBottom: 1,
  },
  customerinfosublast: {
    fontSize: 10,
    textAlign: "left",
    color: "#3a4553",
    marginLeft: 5,
    paddingTop: 1,
    paddingBottom: 1,
    marginBottom: 20,
  },

  headerCell1: {
    fontSize: 11,
    color: "white",
    backgroundColor: "#787878",
    textAlign: "left",
    padding: 3,
    fontWeight: "bold",
    flex: 5,
  },
  headerCell2: {
    fontSize: 11,
    textAlign: "center",
    color: "white",
    backgroundColor: "#787878",
    padding: 3,
    fontWeight: "bold",
    flex: 1,
  },
  headerCell3: {
    fontSize: 11,
    textAlign: "center",
    color: "white",
    backgroundColor: "#787878",
    padding: 3,
    fontWeight: "bold",
    flex: 1,
  },
  headerCell4: {
    fontSize: 11,
    textAlign: "center",
    color: "white",
    backgroundColor: "#787878",
    padding: 3,
    fontWeight: "bold",
    flex: 1,
  },
  tableCell1: {
    fontSize: 10,
    color: "#3a4553",
    textAlign: "left",
    padding: 3,
    flex: 5,
  },
  tableCell2: {
    fontSize: 10,
    color: "#3a4553",
    textAlign: "center",
    padding: 3,
    flex: 1,
  },
  tableCell3: {
    fontSize: 10,
    color: "#3a4553",
    textAlign: "center",
    padding: 3,
    flex: 1,
  },
  tableCell4: {
    fontSize: 10,
    color: "#3a4553",
    textAlign: "center",
    padding: 3,
    flex: 1,
  },
  footerCell1: {
    fontSize: 11,
    color: "white",
    backgroundColor: "#787878",
    textAlign: "left",
    padding: 3,
    fontWeight: "bold",
    flex: 5,
  },
  footerCell2: {
    fontSize: 11,
    color: "white",
    backgroundColor: "#787878",
    textAlign: "center",
    padding: 3,
    flex: 1,
  },
  footerCell3: {
    fontSize: 11,
    color: "white",
    backgroundColor: "#787878",
    textAlign: "center",
    padding: 3,
    flex: 1,
  },
  footerCell4: {
    fontSize: 11,
    color: "white",
    backgroundColor: "#787878",
    textAlign: "center",
    padding: 3,
    flex: 1,
  },
  orderinfohead: {
    marginTop: 30,
    fontSize: 11,
    textAlign: "left",
    color: "white",
    backgroundColor: "#787878",
    width: 200,
    padding: 2,
  },
  orderinfosub: {
    fontSize: 10,
    textAlign: "left",
    color: "#3a4553",
    marginLeft: 5,
    paddingTop: 1,
    paddingBottom: 1,
  },
  header: {
    fontSize: 9,
    marginBottom: 20,
    textAlign: "right",
    color: "grey",
  },
  footer: {
    padding: "100px",
    fontSize: 10,
    marginBottom: 10,
    textAlign: "center",
    color: "#616161",
  },
});

export default Invoice;
