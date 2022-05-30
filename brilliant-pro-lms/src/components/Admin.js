import { useEffect, useState } from "react";
import AdminHome from "./AdminHome";
import AdminSignIn from "./AdminSignIn";

function Admin() {
    const [signIn, setSignIn] = useState(true);

    // useEffect(() => {
    //     fetch('http://localhost:4000/checkAdmin', {
    //         headers: {
    //             'x-access-token' : localStorage.getItem('token')
    //         },
    //         body: {
    //             'userType': 'admin'
    //         },
    //         })
    //         .then(response => response )
    //         .then(data => {
    //             data.isAdmin ? setSignIn(false): setSignIn(true);
    //         })
    //         .catch( (err) => {
    //             console.log("Some error ", err);
    //         });
    // });

    if(signIn)
        return <AdminSignIn />
    return <AdminHome />
};

export default Admin;