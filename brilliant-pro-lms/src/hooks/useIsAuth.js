import { useEffect, useState } from "react";

export default function useIsAuth (userType) {
    const [isAuth, setIsAuth] = useState(0)
    useEffect(() => {
        fetch('http://localhost:4000/checkAdmin', {
            headers: {
                'x-access-token' : localStorage.getItem('token')
            },
            body: {
                'userType': userType
            },
            })
            .then(response => response )
            .then(data => {
                data.isAdmin ? setIsAuth(-1): setIsAuth(1);
            })
            .catch( (err) => {
                console.log("Some error ", err);
            });
    }) 
}