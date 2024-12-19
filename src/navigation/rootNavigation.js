import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import AuthStack from './AuthStack'
import UserStack from './UserStack'
import AdminStack from './AdminStack'
import { useSelector } from 'react-redux'
import app from '../../firebaseConfig'

const rootNavigation = () => {
   const {isAuth, role} = useSelector((state) => state.user);
   
   console.log("Current state:", {isAuth, role}); // Debug için state'i kontrol edelim
    
   return (
     <NavigationContainer>
        {!isAuth ? (
            <AuthStack/>
        ) : role === 'admin' ? (
            <AdminStack/>
        ) : (
            <UserStack/>
        )}
     </NavigationContainer>
   );
}

export default rootNavigation
