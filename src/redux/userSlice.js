import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {getAuth,signOut ,signInWithEmailAndPassword, createUserWithEmailAndPassword} from "firebase/auth"
import { getFirestore, setDoc, doc, getDoc } from 'firebase/firestore';

export const login = createAsyncThunk('user/login', async({email, password}) => {
    try {
        const auth = getAuth();
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        const user = userCredential.user;
        const token = user.stsTokenManager.accessToken;

        // Kullanıcının rolünü Firestore'dan çekme
        const db = getFirestore();
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userRole = userDoc.data().role;

        const userData = {
            token,
            user: user,
            role: userRole
        }
        return userData
    } catch (error) {
        console.log("user login error", error)
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

export const register = createAsyncThunk('user/register', async({email, password}) => {
    try {
        const auth = getAuth()
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        
        const user = userCredential.user;
        const token = user.stsTokenManager.accessToken;
        
        // Firestore'a kullanıcı verilerini ve rolünü ekleme
        const db = getFirestore();
        await setDoc(doc(db, "users", user.uid), {
            email: user.email,
            userId: user.uid,
            role: 'user', // Varsayılan olarak normal kullanıcı
            createdAt: new Date(),
        });

        const userData = {
            token,
            user: user,
            role: 'user'
        };
        
        return userData;
    } catch (error) {
        throw error
    }
})

const initialState = {
    isLoading: false,
    isAuth: false,
    token: null,
    user: null,
    role: null,
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
            state.role = action.payload.role;
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
            state.role = action.payload.role;
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