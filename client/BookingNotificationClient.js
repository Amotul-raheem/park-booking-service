import axios from "axios";

const sendEmail = async (username, email, space_name, checkIn, checkOut, endpoint) => {
    await axios.post(endpoint, {
        space_name: space_name, checkIn: checkIn, CheckOut: checkOut, username: username, email: email
    })

}
export default sendEmail