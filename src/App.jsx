import { useEffect, useState } from "react"
import { RxCross1 } from "react-icons/rx";

function App() {

  const [value, setValue] = useState("");
  const [userData, setUserData] = useState([]);
  const [names, setNames] = useState([]);

  const onChange = (event) => {
    setValue(event.target.value);
  }

  const onSearch = (searchTerm1, searchTerm2) => {
    setValue(searchTerm1+" "+searchTerm2);
    setNames(prevNames => [...prevNames, searchTerm1+" "+searchTerm2]);
    event.target.value='';
  }

  const handleKeyDown = (e) =>{
    if(e.key === 'Enter'){
      const value = e.target.value.trim();
      if(value && !names.includes(value)){
        setNames(prevNames => [...prevNames, value]);
      } 
      e.target.value='';
    }
  };

  const removeUserName = (index) => {
    setNames(names.filter((el,i) => i !== index))
  };

  useEffect(() => {
    const fetchUserData = async() => {
      try{
        const response = await fetch("https://api.slingacademy.com/v1/sample-data/users?offset=10&limit=100");
        const data = await response.json();
        setUserData(data.users);
      }catch(error){
        console.log("Error occured!");
      }
    }
    fetchUserData();
  },[]);

  return (
    <>
        <h1 className="text-center text-4xl font-bold text-blue-700 p-9">Pick Users</h1>
      <div className="w-full h-screen p-5">
        <div className="w-full text-xl flex flex-wrap pt-9 items-center gap-3">
          {names.map((userName, index) => (
              <div key={userName}>
                  <span className="flex items-center px-2 py-1 border-2 gap-2 border-stone-600 rounded-3xl bg-stone-200">
                    {userData.map((item) => (
                      (item.first_name+" "+item.last_name).toLowerCase() === userName.toLowerCase() && (
                        <div key={item.id}>
                            <img src={item.profile_picture} alt={item.first_name} className="w-10 rounded-full border-2 border-stone-400"/>
                        </div>
                      )
                    ))} 
                    {userName} <RxCross1 onClick={() => removeUserName(index)} className="cursor-pointer"/></span>
              </div>
          ))}
        </div>
        <div className="mt-20">
          <input type="text" value={value} onChange={onChange} onKeyDown={handleKeyDown} className="w-full px-3 py-1 pl-36 border-b-2 border-b-blue-500 outline-none"/>
        </div>
        <div className="w-[51%] max-h-72 mx-auto shadow p-4 mt-2 overflow-y-scroll overflow-x-hidden">
          {Array.isArray(userData) && userData
          .filter((item) => {
            const searchTerm = value.toLowerCase();
            const name = (item.first_name + item.last_name).toLowerCase();

            return searchTerm && name.includes(searchTerm);
          })
          .map((item) => (
            <div key={item.id} onClick={() => onSearch(item.first_name, item.last_name)} className="flex items-center hover:border-2 hover:border-stone-400 hover:rounded-lg px-4">
              <img src={item.profile_picture} className="w-14 rounded-full border-2 border-stone-100" /> 
              <span className="text-lg font-bold w-[30%] mx-2">{item.first_name} {item.last_name}</span>
              <span className="text-stone-700 text-base">{item.email}</span>
            </div>
          ))
          }
        </div>
      </div>
    </>
  )
}

export default App
