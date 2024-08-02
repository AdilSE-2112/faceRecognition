import React, { useState } from "react";
import Layout from "../../components/layout";
import "./style.scss";
import ProfileIcon from "../../assets/icons8-male-user-100.png"
import UserInfo from "./User/UserInfo/UserInfo";




const ProfilePage = () => {

  return (
    <Layout>
     <div className="profile-page">
        <div className="container">
            <div className="title">Профиль</div>
            <div className="profile-box">
                <div className="icon">
                
                <img src={ProfileIcon} className="profile-icon" alt="Profile Icon" />
                </div>
            <div className="user-info">
                <UserInfo/>
                <div className="change-button">
                    <button className="edit-button">
                        Изменить
                    </button>
                </div>
            </div>
            
            </div>
        </div>
     </div>
    </Layout>
  );
};



export default ProfilePage;
