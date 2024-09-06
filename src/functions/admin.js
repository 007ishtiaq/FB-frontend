import axios from "axios";

export const getSalesdata = async (authtoken) =>
  await axios.get(`${process.env.REACT_APP_API}/admin/sales`, {
    headers: {
      authtoken,
    },
  });

export const getFlashInfo = async (authtoken) =>
  await axios.get(`${process.env.REACT_APP_API}/admin/flash`, {
    headers: {
      authtoken,
    },
  });

export const getOrders = async (authtoken) =>
  await axios.get(`${process.env.REACT_APP_API}/admin/orders`, {
    headers: {
      authtoken,
    },
  });
export const getRejectedOrders = async (authtoken) =>
  await axios.get(`${process.env.REACT_APP_API}/admin/rejected-orders`, {
    headers: {
      authtoken,
    },
  });
export const getcompletedOrders = async (authtoken) =>
  await axios.get(`${process.env.REACT_APP_API}/admin/completed-orders`, {
    headers: {
      authtoken,
    },
  });
export const getreturnedOrders = async (authtoken) =>
  await axios.get(`${process.env.REACT_APP_API}/admin/returned-orders`, {
    headers: {
      authtoken,
    },
  });

export const changeStatus = async (orderId, orderStatus, authtoken) =>
  await axios.put(
    `${process.env.REACT_APP_API}/admin/order-status`,
    { orderId, orderStatus },
    {
      headers: {
        authtoken,
      },
    }
  );

export const changeAccept = async (orderId, orderAccept, authtoken) =>
  await axios.put(
    `${process.env.REACT_APP_API}/admin/order-accept`,
    { orderId, orderAccept },
    {
      headers: {
        authtoken,
      },
    }
  );

// getOrder used which is already using by user in user functions

export const OrderUpdate = async (
  orderId,
  prodId,
  productId,
  form,
  authtoken
) =>
  await axios.put(
    `${process.env.REACT_APP_API}/admin/order-edit`,
    { orderId, prodId, productId, form },
    {
      headers: {
        authtoken,
      },
    }
  );

export const removeOrderItem = async (id, prodId, authtoken) =>
  await axios.put(
    `${process.env.REACT_APP_API}/admin/order/item-delete/`,
    { id, prodId },
    {
      headers: {
        authtoken,
      },
    }
  );

export const getActionInfo = async (prodId, currentinfo, authtoken) =>
  await axios.put(
    `${process.env.REACT_APP_API}/order/action`,
    { prodId, currentinfo },
    {
      headers: {
        authtoken,
      },
    }
  );

export const getEntries = async (authtoken) =>
  await axios.get(`${process.env.REACT_APP_API}/admin/ledger`, {
    headers: {
      authtoken,
    },
  });

export const setCashback = async (OrderId, authtoken) =>
  await axios.put(
    `${process.env.REACT_APP_API}/order/cashback`,
    { OrderId },
    {
      headers: {
        authtoken,
      },
    }
  );
export const setPaid = async (OrderId, authtoken) =>
  await axios.put(
    `${process.env.REACT_APP_API}/order/paid`,
    { OrderId },
    {
      headers: {
        authtoken,
      },
    }
  );
export const setbackDeliver = async (OrderId, authtoken) =>
  await axios.put(
    `${process.env.REACT_APP_API}/order/delivery`,
    { OrderId },
    {
      headers: {
        authtoken,
      },
    }
  );
export const makeEntry = async (newentry, authtoken) =>
  await axios.put(
    `${process.env.REACT_APP_API}/ledger/entry`,
    { newentry },
    {
      headers: {
        authtoken,
      },
    }
  );
export const deleteEntry = async (id, authtoken) =>
  await axios.delete(`${process.env.REACT_APP_API}/ledger/entry/${id}`, {
    headers: {
      authtoken,
    },
  });
