import { Link} from "react-router-dom";
import { Box, Button } from "@mui/material";
import {useEffect} from "react";

export const MainPage = () => {
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("accessToken");
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
    <Box sx={{ display: "flex", gap: 2, alignItems: "center" , flexDirection: "column", width: "80%", ml: "10%", mr: "10%", mt: "20%"}}>

        <Box sx={{ display: "flex"}}>
            <Button color="inherit" component={Link} to="/accounts" sx={{width: "40%", ml: "5%", mr: "5%"}}>
                Все ваши счета.
                Перейдите на страницу просмотра и работы с дебетовыми и кредитными счетми!
            </Button>
            <Button color="inherit" component={Link} to="/tariffs" sx={{width: "40%", ml: "5%", mr: "5%" }}>
                Предложения по кредитам.
                Посмотрите все наши лучшие предложения по кредитам.
            </Button>
        </Box>
        <Box sx={{ display: "flex"}}>
            <Button color="inherit" component={Link} to="/credits" sx={{width: "40%", ml: "5%", mr: "5%" }}>
                Ваши кредиты.
                Перейдите на старницу с вашими актуальными кредитами!
            </Button>
            <Button color="inherit" component={Link} to="/abountUs" sx={{width: "40%", ml: "5%", mr: "5%" }}>
                Инфомация о нас.
            </Button>
        </Box>
    </Box>
  );
};

