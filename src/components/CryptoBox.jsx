import React, { useState, useEffect } from "react";
import "../styles/CryptoBox.css";
import "../styles/DropDown.css";
import { tokens } from "../data/CryptoData.js";
import { MdArrowDropDown, MdClose, MdCheck } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import axios from "axios";

const CryptoBox = () => {
  const [currCrypto, setCrypto] = useState(0);
  const [toggle, setToggle] = useState(false);
  const [currPrice, setPrice] = useState(0);
  const [coins, setCoins] = useState("");
  const [search, setSearch] = useState("");

  let webSocketFetch = () => {
    let ws = new WebSocket(tokens[currCrypto].ws);
    let price = 0;
    setPrice("--");
    setCoins("");
    if (currCrypto == 2) setPrice(80);
    ws.onmessage = (event) => {
      let data = JSON.parse(event.data);
      if (price == 0) {
        price = parseFloat(data.p).toFixed(2);
        setPrice(Math.round(price * 80));
        console.log(price);
      }
      return;
    };
  };

  let currencyFetch = async () => {
    const options = {
      method: "GET",
      url: "https://currency-exchange.p.rapidapi.com/exchange",
      params: {
        from: "GBP",
        to: "INR",
        q: "1.0",
      },
      headers: {
        "X-RapidAPI-Key": "576deacf59msh6c5a79f92f53feep11db34jsn7727c0865a26",
        "X-RapidAPI-Host": "currency-exchange.p.rapidapi.com",
      },
    };

    let price = 0;
    setPrice("--");
    setCoins("");

    let data = await axios.request(options);
    price = data.data;
    setPrice(Math.round(price * 100) / 100);
    console.log(price);
  };

  useEffect(() => {
    currCrypto == 20 ? currencyFetch() : webSocketFetch();
  }, [currCrypto]);

  return (
    <div className="box-container">
      <div className="box">
        <div className="semicircle">
          <img src={tokens[currCrypto].logo} className="top-logo" alt="" />
        </div>
        <div className="current-value">
          <div>Current value</div>
          <div id="value">
            <div id="rupee">&#8377;</div> {currPrice}
          </div>
        </div>
        <div className="dropdown-bar" onClick={() => setToggle(true)}>
          <div className="crypto">
            <div className="crypto-icon">
              <img
                src={tokens[currCrypto].logo}
                className="crypto-icon-img"
                alt=""
              />
            </div>
            <div className="crypto-text">{tokens[currCrypto].name}</div>
          </div>
          <MdArrowDropDown size={"30px"} className="arrow" />
        </div>
        <div className="invest-text">Amount you want to invest</div>
        <input
          type="text"
          placeholder="0.00"
          className="invest-input"
          value={coins}
          onChange={(e) => {
            setCoins(e.target.value);
          }}
        />
        <div className="inr">INR</div>
        <div className="invest-text">
          Estimate Number of {tokens[currCrypto].abbr} You will Get
        </div>
        <div className="result">
          {currPrice > 0 ? Math.round((coins / currPrice) * 100) / 100 : 0.0}
        </div>
        {/* <button className="button" id="buy">
          Buy
        </button> */}
      </div>

      {/* DropDown */}
      {toggle && (
        <div>
          <div className="blur-layer"></div>
          <div className="dropdown-box">
            <MdClose
              size={"25px"}
              className="close"
              onClick={() => {
                setToggle(false);
                setSearch("");
              }}
            />
            <CiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search chains"
              className="search"
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="dropdown-items">
              {tokens
                .filter((item) => {
                  return search.toLowerCase() === ""
                    ? item
                    : item.name.toLowerCase().includes(search);
                })
                .map((item, id) => {
                  return (
                    <div
                      className="dropdown-item"
                      key={id}
                      onClick={() => {
                        setCrypto(item.index);
                        setToggle(false);
                        setSearch("");
                      }}
                    >
                      <div className="token">
                        <img src={item.logo} className="logo" alt="" />
                        {item.name}
                      </div>
                      {currCrypto == item.index ? (
                        <MdCheck className="check" size={"25px"} />
                      ) : (
                        ""
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CryptoBox;
