import React from "react";
import AppTheme from "./AppTheme";
import InjectedDialog from "./components/InjectedDialog/InjectedDialog";
import ChannelContextProvider from "./context/channel/ChannelContext";
import DmContextProvider from "./context/dm/DmContext";
import GuildContextProvider from "./context/guild/GuildContext";
import MessageContextProvider from "./context/message/MessageContext";
import UserContextProvider from "./context/user/UserContext";
import GlobalStyles from "@mui/material/GlobalStyles";

function App() {
  return (
    <>
      <GlobalStyles
        styles={{
          "&::-webkit-scrollbar": {
            width: "5px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#f1f1f1",
          },
          "&::-webkit-scrollbar-track": {
            background: "#888",
          },
        }}
      />
      <AppTheme>
        <UserContextProvider>
          <GuildContextProvider>
            <ChannelContextProvider>
              <DmContextProvider>
                <MessageContextProvider>
                  <InjectedDialog />
                </MessageContextProvider>
              </DmContextProvider>
            </ChannelContextProvider>
          </GuildContextProvider>
        </UserContextProvider>
      </AppTheme>
    </>
  );
}

export default App;
