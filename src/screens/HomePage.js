import { StyleSheet, Text, View } from 'react-native'
import React,{useState, useEffect} from 'react'
import { collection, addDoc, getDocs, doc, deleteDoc } from 'firebase/firestore'
import { db } from '../../firebaseConfig'
import CustomButton from '../components/CustomButton'
import { useDispatch } from 'react-redux'
import { logout } from '../redux/userSlice'

const HomePage = () => {

  const [data, setData] = useState([])
  const [isSaved, setIsSaved] = useState(false)

  const dispatch= useDispatch()
  console.log(isSaved)

  useEffect(() => {
    getData()
  }, [isSaved])
  

  //veri gönderme
  const sendData = async()=>{

    try {
      const docRef = await addDoc(collection(db, "users"),{
        title : "baslik",
        content: "icerik",
        lesson: 54
      });
      console.log("Document written with ID",docRef.id)
    } catch (error) {
      console.error("error adding document", error)
    }
  }
// veri alma

  const getData= async ()=>{
    const allData = []
    try {
      const querySnapshot= await getDocs(collection(db,"users"));
    querySnapshot.forEach((doc)=>{
      //console.log(`${doc.id} => ${doc.data()}`);
      allData.push({...doc.data(), id: doc.id})
    });
    setData (allData)
    } catch (error) {
      console.log(error)
    }

  }
// veri silme

  const deleteData = async()=>{
    await deleteDoc(doc(db,"users", "vjPB3rN3i8hGv6u73WQe"))
  }

  const handleLogout =()=>{
    dispatch(logout())
  }


  return (
    <View style={styles.container}>
      {data.map((value, index)=>{
        return(
          <View key={index}>
            <Text>{index}</Text>
            <Text>{value.id}</Text>
            <Text>{value.title}</Text>
            <Text>{value.content}</Text>
            <Text>{value.lesson}</Text>
          </View>
        )
      })}
      <CustomButton
      buttonText="Data save"
      setWith="80%"
      handleOnPress={()=>{sendData(),setIsSaved(isSaved===false ? true : false) }}
    />
    <CustomButton
      buttonText="Get data"
      setWith="80%"
      handleOnPress={getData}
    />
    <CustomButton
      buttonText="Çıkış yap"
      setWith="80%"
      handleOnPress={handleLogout}
    />
    </View>
  )
}

export default HomePage

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }
})