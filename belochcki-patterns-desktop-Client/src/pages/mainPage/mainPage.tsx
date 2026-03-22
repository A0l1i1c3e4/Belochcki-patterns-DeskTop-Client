import { Link} from "react-router-dom";
import {useEffect} from "react";
import "./MainPage.css";



export const MainPage = () => {

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);

        const token = params.get("accessToken");
        const userId = params.get("userId");

        if (userId){
            localStorage.setItem("userId", userId);
        }

        if (token) {
          localStorage.setItem("accessToken", token);
          window.history.replaceState({}, document.title, "/");
        }
        console.log(token);

        const testToken = localStorage.getItem('accessToken');

        if (!testToken){
            window.location.href = "http://localhost:666/main";
        }
      }, []);

    return (
        <div className="main-page">
            <h1 className="main-title">Главное меню</h1>

            <div className="card-grid">
                <Link to="/accounts" className="card">
                <h3>Счета</h3>
                <p>Просмотр и управление дебетовыми и кредитными счетами</p>
                </Link>

                <Link to="/tariffs" className="card">
                <h3>Кредитные тарифы</h3>
                <p>Лучшие предложения по кредитам</p>
                </Link>

                <Link to="/credits" className="card">
                <h3>Кредиты</h3>
                <p>Управление активными кредитами</p>
                </Link>

                <Link to="/abountUs" className="card">
                <h3>О нас</h3>
                <p>Информация о нас</p>
                </Link>
            </div>
        </div>
    );
};
