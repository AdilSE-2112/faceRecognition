import React from "react";
import TitleInputPair from "../TitleInputPair/TitleInputPair";
import "./style.scss"

const UserInfo = () => {
  const titleInputData = [
    { title: "Имя", placeholder: "Мадияр" },
    { title: "Фамилия", placeholder: "Куанышбеков" },
    { title: "Отчество", placeholder: "Еркебуланович" },
    { title: "ИИН", placeholder: "05050505404" },
    { title: "Организация", placeholder: "АФМ" },
  ];

  return (
    <div className="user-info">
      {titleInputData.map((data, index) => (
        <TitleInputPair
          key={index}
          title={data.title}
          placeholder={data.placeholder}
        />
      ))}
    </div>
  );
};

export default UserInfo;