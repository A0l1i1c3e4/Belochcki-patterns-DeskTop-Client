import { Routes, Route,  Navigate } from "react-router-dom";
import  MainLayout  from "../shared/ui/layout/mainLayout.tsx";


import { MainPage } from "../pages/mainPage/mainPage.tsx";
import { ProfilePage } from "../pages/profilePage/ProfilePage.tsx";
import { AccountsPage } from "../pages/accountsPage/accountsPage.tsx";
import { DebitAccountPage } from "../pages/debitAccountPage/debitAccountPage.tsx";
import { CreditAccountPage } from "../pages/creditAccountPage/creditAccountPage.tsx";
import { CreditsPage } from "../pages/creditsPage/creditsPage.tsx";
import { CreditTariffsPage } from "../pages/creditTariffsPage/creditTariffsPage.tsx";
import { AbountUsPage } from "../pages/abountUsPage/abountUsPage.tsx";
import { Error500Page } from "../pages/error500/error500.tsx";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<MainPage />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
 
      <Route element={<MainLayout />}>
        <Route path="*" element={<h1>Страница не найдена</h1>} />
        <Route path="/error-500" element={<Error500Page />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/accounts" element={<AccountsPage />} />
        <Route path="/debitaccount/:accountId" element={<DebitAccountPage />} />
        <Route path="/creditaccount/:accountId" element={<CreditAccountPage />} />
        <Route path="/credits" element={<CreditsPage />} />
        <Route path="/tariffs" element={<CreditTariffsPage />} />
        <Route path="/abountUs" element={<AbountUsPage />} />
      </Route>
    </Routes>
  );
};






