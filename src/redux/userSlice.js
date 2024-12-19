import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {getAuth,signOut ,signInWithEmailAndPassword, createUserWithEmailAndPassword} from "firebase/auth"


export const login = createAsyncThunk( 'user/login', async({email, password}) =>{
    try {
        const auth =getAuth();
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        const user= userCredential.user;
        const token= user.stsTokenManager.accessToken;

        const userData ={
            token,
            user: user,
        }
        return userData
    } catch (error) {
        console.log("user line 18 satır",error)
        throw error
    }
})



// kullanıcı çıkış işlemi

export const logout = createAsyncThunk('user/logout',async()=>{
    try {
        const auth = getAuth()
        await signOut(auth)
        return null;
    } catch (error) {
        throw error
    }
})


//kullanıcı kayıt islemleri

export const register = createAsyncThunk('user/register', async({email,password})=>{
    try {
        const auth = getAuth()
        const userCredential = await createUserWithEmailAndPassword(auth, email,password)

        const user= userCredential.user;
        const token= user.stsTokenManager.accessToken;
        const userData = {
            token,
            user: user,
        };
        
        return userData;
    } catch (error) {
        throw error
    }
})

const initialState ={
    isLoading: false,
    isAuth: false,
    token : null,
    user: null,
    error: null
}

export const userSlice = createSlice({

    name:'user',
    initialState,
    reducers:{
        setEmail: (state, action)=>{
            state.email = action.payload
        },
        setPassword: (state, action)=>{
            state.password = action.payload
        },
        setIsLoading: (state, action)=>{
            state.isLoading = action.payload
        }

    },
    extraReducers: (builder) =>{
        builder
        .addCase(login.pending, (state)=> {
            state.isLoading= true;
            state.isAuth = false
        })
        .addCase(login.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.isAuth= true;
            state.user= action.payload.user;
            state.token = action.payload.token;
        })
        .addCase(login.rejected, (state, action)=>{
            state.isLoading= false;
            state.isAuth=false;
            state.error = action.error.message;
        })
        .addCase(logout.pending, (state)=>{
            state.isLoading= true;
        })
        .addCase(logout.fulfilled, (state) => {
            state.isLoading = false;
            state.isAuth = false;
            state.user = null;     // User bilgisini temizle
            state.token = null;    // Token'ı temizle
            state.error = null;
        })
        .addCase(logout.rejected, (state, action)=>{
            state.isLoading = false;
            state.error = action.payload
        })
        .addCase(register.pending, (state)=>{
            state.isLoading = true;
            state.isAuth = false;
            
        })
        .addCase(register.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.isAuth = true;
            state.error = action.payload
        })
        .addCase(register.rejected, (state, action)=>{
            state.isLoading = false;
            state.isAuth = false;
            state.error = "invalid email or password"
        })
    }

})

export const {setEmail, setPassword, setIsLoading }= userSlice.actions
export default userSlice.reducer;