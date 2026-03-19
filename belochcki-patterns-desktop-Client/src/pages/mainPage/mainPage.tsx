import { Link} from "react-router-dom";
import { Box, Button } from "@mui/material";



export const MainPage = () => {

  return (
    <Box sx={{ display: "flex", gap: 2, alignItems: "center" , flexDirection: "column", width: "70%"}}>

        <Box sx={{ display: "flex", gap: 1, mt: 0.5 }}>
            <Button color="inherit" component={Link} to="/accounts">
                Все ваши счета.
                Перейдите на страницу просмотра и работы с дебетовыми и кредитными счетми!
            </Button>
            <Button color="inherit" component={Link} to="/credit_tarifs">
                Предложения по кредитам.
                Посмотрите все наши лучшие предложения по кредитам.
            </Button>
        </Box>
        <Box sx={{ display: "flex", gap: 1, mt: 0.5 }}>
            <Button color="inherit" component={Link} to="/credits">
                Ваши кредиты.
                Перейдите на старницу с вашими актуальными кредитами!
            </Button>
            <Button color="inherit" component={Link} to="/abount_us">
                Инфомация о нас.
            </Button>
        </Box>
    </Box>
  );
};

