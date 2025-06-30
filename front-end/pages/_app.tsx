import type { AppProps } from "next/app";
import { UserProvider } from "../context/userContext"; // adjust path if needed
import { AccountProvider } from "../context/accountContext";
import { PagamentProvider } from "../context/pagamentContext";
import { IncomeProvider } from "../context/incomeContext";
import "../scss/Login/login.css";
import "../scss/Welcome/Welcome.css";
import "../scss/Account/Account.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <AccountProvider>
        <PagamentProvider>
        <IncomeProvider>
          <Component {...pageProps} />
        </IncomeProvider>
          
        </PagamentProvider>
      </AccountProvider>
      
    </UserProvider>
  );
}
