import "../styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import Navbar from "../components/NavBar"

import { Connect } from "@stacks/connect-react";

import { userSession } from "../components/ConnectWallet";

function MyApp({ Component, pageProps }) {
  let icon;
  if (typeof window !== "undefined") {
    icon = window.location.origin + "/nft-logo.png";
  }

  return (
    <Connect
      authOptions={{
        appDetails: {
          name: "Arcus",
          icon,
        },
        redirectTo: "/",
        onFinish: () => {
          window.location.reload();
        },
        userSession,
      }}
    >
    
      <ChakraProvider>
        <Navbar />
        <Component {...pageProps} />
      </ChakraProvider>
    </Connect>
  );
}

export default MyApp;
