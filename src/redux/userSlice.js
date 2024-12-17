import { createSlice } from "@reduxjs/toolkit";

const initialState ={

    email: null,
    password: null,
    isLoading: false,
    isAuth: false,
    users:{
        useremail:"test.com",
        userpassword:"12345"
    }
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
        },
        setLogin: (state) => {
            if((state.email=== state.users.useremail) && (state.password=== state.users.userpassword)){
                
                state.isAuth = true
            }
            else
            {
                
                state.isAuth = false
            }

        }

    }

})

export const {setEmail, setPassword, setIsLoading, setLogin }= userSlice.actions
export default userSlice.reducer;