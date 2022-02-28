import { configureStore, Store } from "@reduxjs/toolkit";
import connectReducer from "./state/connect/connect";
import walletReducer from "./state/wallet/wallet";
import stakeReducer from "./state/stake/stake";
import txReducer from "./state/tx/tx";
import priceReducer from "./state/price/price";

export const store: Store = configureStore({
    reducer: {
        connect: connectReducer,
        price: priceReducer,
        stake: stakeReducer,
        tx: txReducer,
        wallet: walletReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
