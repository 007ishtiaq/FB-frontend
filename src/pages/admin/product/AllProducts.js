import React, { useEffect, useState } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import AdminProductCard from "../../../components/cards/AdminProductCard";
import {
  removeProduct,
  getProdJson,
  uploadproductsjson,
} from "../../../functions/product";
import { deleteReviewImages } from "../../../functions/admin";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import FlashsaleProductCard from "../../../components/ProductCards/FlashsaleProductCard";
import "../../../components/ProductCards/ProductCardsAll.css";
import "./AllProducts.css";
import {
  fetchProductsByFilter,
  getProductsByPage,
} from "../../../functions/product";
import { Pagination } from "antd";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [page, setPage] = useState(1); // page number
  const [perPage, setPerpage] = useState(2); // per page Size
  const [productsCount, setProductsCount] = useState(0);
  const [jsonfile, setJsonfile] = useState(null);

  // redux
  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    const delayed = setTimeout(() => {
      if (text) {
        fetchProducts({ query: text });
      } else {
        loadAllProducts();
      }
    }, 300);

    return () => clearTimeout(delayed);
  }, [page, text]);

  useEffect(() => {
    setPage(1);
  }, [text]);

  const loadAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await getProductsByPage({ page, perPage });
      setProducts(data.products);
      setProductsCount(data.totalProducts);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = (slug, images) => {
    // Extract all public_ids from the images array
    const publicIds = images.map((image) => image.public_id);

    if (window.confirm("Delete?")) {
      deleteReviewImages(publicIds, user.token)
        .then(() => {
          removeProduct(slug, user.token)
            .then((res) => {
              loadAllProducts();
              toast.success(`${res.data.title} is deleted`);
            })
            .catch((err) => {
              if (err.response.status === 400) toast.error(err.response.data);
              console.log(err);
            });
        })
        .catch((err) => {
          // console.log("Failed to delete images", err);
          toast.error("Failed to delete images");
        });
    }
  };

  const fetchProducts = (arg) => {
    fetchProductsByFilter({ arg, page, perPage }).then((res) => {
      setProducts(res.data.products);
      setProductsCount(res.data.totalProducts);
    });
  };

  const handleChange = (e) => {
    e.preventDefault();
    setText(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchProducts({ query: text });
  };

  const DownloadProdJson = async () => {
    try {
      getProdJson(user.token)
        .then((res) => {
          toast.success(`Json Downloaded`);
          const data = res.data;
          // Convert JSON data to a downloadable file
          const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: "application/json",
          });
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = "MMFB-Products-data.json";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        })
        .catch((error) => {
          console.error("Error fetching schema data:", error);
        });
    } catch (error) {
      console.error("Error fetching schema data:", error);
    }
  };

  const handleFileChange = (e) => {
    setJsonfile(e.target.files[0]);
  };

  const readFileAsync = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  };

  const handleUpload = async () => {
    if (!jsonfile) {
      alert("Please select a file!");
      return;
    }
    try {
      const fileContent = await readFileAsync(jsonfile); // Read file asynchronously
      const jsonData = JSON.parse(fileContent); // Parse JSON
      console.log("Parsed JSON Data:", jsonData);

      // Validate data
      if (!jsonData || (Array.isArray(jsonData) && jsonData.length === 0)) {
        alert("The JSON file is empty or invalid.");
        return;
      }

      const response = await uploadproductsjson(jsonData, user.token); // Upload data
      alert(response.data.message);
    } catch (error) {
      if (error.name === "SyntaxError") {
        alert("The JSON file contains invalid syntax.");
      } else {
        alert("An error occurred while uploading the file.");
      }
      console.error("Error while uploading JSON file:", error);
    }
  };

  return (
    <div className="col">
      <div className="adminAllhead">
        {loading ? (
          <h4 className="text-danger">Loading...</h4>
        ) : (
          <h4>All Products</h4>
        )}
        <form onSubmit={handleSubmit}>
          <input
            id="search-admin"
            name="search-admin"
            onChange={handleChange}
            class="searchadmin"
            type="search"
            value={text}
          />
          {/* <button type="submit">submit</button> */}
        </form>
        <button className="mybtn btnsecond jsonbtns" onClick={DownloadProdJson}>
          Download Json
        </button>
        <div className="uploadjson">
          <input
            type="file"
            accept=".json"
            className="jsonuploadinput"
            onChange={handleFileChange}
          />
          <button className="mybtn btnsecond jsonbtns" onClick={handleUpload}>
            Upload JSON
          </button>
        </div>
      </div>

      <div className="row">
        {products.map((prod) => (
          <div key={prod._id} className="col-md-3 pb-3">
            <AdminProductCard
              key={prod._id}
              product={prod}
              contWidth={1200}
              FlashSalesCont={true}
              handleRemove={handleRemove}
            />
          </div>
        ))}
      </div>
      <div class="productreviewbottom searchpagi">
        <div class="previewpagination">
          <Pagination
            current={page}
            total={productsCount}
            pageSize={perPage}
            onChange={(value) => setPage(value)}
          />
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
