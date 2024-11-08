import React from "react";
import FundCardStyle from "./FundCard.module.scss";

function FundCard({ fundId, fundName, price, dailyEarning, currentFund, onClick }) {
  return (
    <div className={FundCardStyle.fundCard}>
      <h2>{fundName}</h2>
      <div className={FundCardStyle.infos}>
        <span>Fiyat</span>
        <span>Günlük Getiri</span>
      </div>
      <div className={FundCardStyle.subInfos}>
        <span>${price}</span>
        <span>${dailyEarning}</span>
      </div>
      <div className={FundCardStyle.btnWrapper}>
        <button 
          name={fundId}
          onClick={fundId > currentFund ? onClick : null}
          className={fundId > currentFund ? FundCardStyle.activeBtn : FundCardStyle.passiveBtn} 
        >
          Satın Al
        </button>
      </div>
    </div>
  );
}

export default FundCard;
