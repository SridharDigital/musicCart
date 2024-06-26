import { useLocation, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Rating from "react-rating";

import "./productDetails.css";
import leftArrow from "../../assets/leftArrow.svg";
import goldenStar from "../../assets/goldenStar.svg";
import emptyStar from "../../assets/emptyStar.svg";
import { callApi } from "../../utils/callApi";
import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import DesktopHeader from "../../components/desktopHeader/DesktopHeader";
import ProductImageCarousel from "./productImageCarousel/ProductImageCarousel";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import { addToCart } from "../../utils/addToCart";

const ProductDetails = (props) => {
  const [productDetails, setProductDetails] = useState({});
  const userId = useSelector((state) => state.user.userId);

  const location = useLocation();
  const navigate = useNavigate();

  const fetchProductDetails = async () => {
    try {
      const paths = location.pathname.split("/");
      const productId = paths[[paths.length - 1]];
      const productDetails = await callApi(
        "GET",
        "/products/details/" + productId
      );
      // console.log({ productDetails })
      setProductDetails(productDetails);
    } catch (error) {
      console.log(error);
    }
  };

  const onClickAddToCart = async () => {
    if (!userId) {
      return navigate("/login");
    }
    const status = await addToCart(userId, productDetails._id);
    if (status) {
      navigate("/cart");
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, []);

  return (
    <>
      <DesktopHeader
        displayViewCart
        displayPath={`Home/ ${productDetails.name}`}
      />
      <ContentWrapper>
        <Link to="/" style={{ textDecoration: "none" }}>
          <img src={leftArrow} className="left-arrow-icon" />
        </Link>{" "}
        <br />
        <Link to="/cart" style={{ textDecoration: "none" }}>
          <button className="product-details-buy-now-btn btn-top">
            Buy Now
          </button>
        </Link>
        <Link to="/" style={{ textDecoration: "none" }}>
          <button className="product-details-back-to-products-btn">
            Back to products
          </button>
        </Link>
        <br />
        <p className="desktop-product-details-title">{productDetails.title}</p>
        <div className="carousel-and-content-container">
          {productDetails.images ? (
            <ProductImageCarousel images={productDetails.images} />
          ) : null}
          <div className="product-details-content-container">
            <h1>{productDetails.name}</h1>
            <div className="rating-and-rating-count-container">
              <Rating
                initialRating={productDetails.rating}
                emptySymbol={<img src={emptyStar} className="icon" />}
                fullSymbol={<img src={goldenStar} className="icon" />}
                readonly
              />
              <p>
                ({productDetails.ratingCount?.toLocaleString("en-US")} Customer
                reviews)
              </p>
            </div>
            <h2 className="product-details-title-text">
              {productDetails.title}
            </h2>
            <p className="product-details-price">
              Price - ₹ {productDetails.price?.toLocaleString("en-US")}
            </p>
            <p style={{ fontWeight: "500" }}>
              {productDetails.color?.charAt(0).toUpperCase() +
                productDetails.color?.slice(1).toLowerCase()}{" "}
              |{" "}
              {productDetails.type?.charAt(0).toUpperCase() +
                productDetails.type?.slice(1).toLowerCase()}
            </p>
            <p className="about-this-item">About this item</p>
            <ul>
              {productDetails.description?.map((eachPoint) => (
                <li>{eachPoint}</li>
              ))}
            </ul>
            <p style={{ fontWeight: "500", marginBottom: "6px" }}>
              Avaliable -{" "}
              <span style={{ fontWeight: "400" }}>
                {productDetails.isAvailable ? "In stock" : "Out of stock"}{" "}
              </span>
            </p>
            <p style={{ fontWeight: "500", marginTop: "0px" }}>
              Brand -{" "}
              <span style={{ fontWeight: "400" }}>
                {productDetails.company}
              </span>
            </p>
            <button
              className="product-details-add-to-cart-btn"
              onClick={onClickAddToCart}
            >
              Add to cart
            </button>
            <br />
            <Link to="/cart" style={{ textDecoration: "none" }}>
              <button className="product-details-buy-now-btn">Buy Now</button>
            </Link>
          </div>
        </div>
      </ContentWrapper>
    </>
  );
};

export default ProductDetails;
