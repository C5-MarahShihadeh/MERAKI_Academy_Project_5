import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";
import {
  addProductts,
  deleteproductts,
  updateproductts,
  setProducts,
} from "../../redux/reducers/products/index";
import {
  addCategoriess,
  deleteCategoriess,
  updateCategoriess,
  setCategories,
} from "../../redux/reducers/categories";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  setBasket,
  updateBasket,
  deleteFromBasket,
  addToBasket,
  setAmount,
  setPrice,
} from "../../redux/reducers/basket/index";
import { FiPlus } from "react-icons/fi";
const SearchResult = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const { token, isLoggedIn } = useSelector((state) => {
    return {
      token: state.auth.token,
      isLoggedIn: state.auth.isLoggedIn,
    };
  });
  const { products, productName } = useSelector((state) => {
    return {
      products: state.products.products,
      productName: state.products.productName,
    };
  });
  const categoriesState = useSelector((state) => {
    return {
      categories: state.categories.categories,
    };
  });
  const basketState = useSelector((state) => {
    return {
      basket: state.basket.basket,
    };
  });

  const getProductBySearch = () => {
    axios
      .get(`https://bigbites-backend.herokuapp.com/product/search?productName=${productName}`)
      .then((result) => {
        dispatch(setProducts(result.data.result));
        console.log("hi", result.data.result);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    getProductBySearch();
  }, []);

  const addToCart = (String) => {
    axios
      .post(
        `https://bigbites-backend.herokuapp.com/basket/${String}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((result) => {
        setMessage("Added To Basket");
      })
      .catch((err) => {
        console.log("header", token);
        console.log(err);
        setMessage(err.message);
      });
  };

  return (
    <div className="producttss">
      {products.map((element, index) => {
        return (
          <div className="Product-Container" key={index}>
            <div className="product-All-Detiles">
              <div className="Product-Img-Dev">
                <img className="imgg" src={element.img} />
              </div>
              <div className="pppp">
                <div className="tow">
                  <div className="pName"> {element.productName}</div>
                  <p className="desc"> {element.description}</p>
                  <div className="price">{element.price} JD</div>
                </div>
                {isLoggedIn ? (
                  <div className="adding-Product">
                    <button
                      className="bttt"
                      onClick={() => {
                        addToCart(element.id);
                        dispatch(setAmount());
                        dispatch(setPrice(element.price));
                      }}
                    >
                      <div class="tooltip">
                        <span class="tooltiptext">add to basket</span>
                        <FiPlus />
                      </div>
                    </button>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
        );
      })}

      <div>
        {products.length === 0 ? (
          <p>Your search didn't match any product.</p>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default SearchResult;
