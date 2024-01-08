import { useContext, useEffect } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";

const useSetCurrentUser = () => {
  const { setCurrentUser } = useContext(UserContext);
  const userId = localStorage.getItem("id");

  useEffect(() => {
    axios.get(`http://localhost:8080/api/user-cars/${userId}`).then((res) => {
      setCurrentUser(res.data);
    });
  }, []);
};

export default useSetCurrentUser;
