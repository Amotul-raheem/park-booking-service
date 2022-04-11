import axios from "axios";

const sendEmail = async (username,space_name, checkIn, checkOut, endpoint) => {
    await axios.post(endpoint, {
        space_name: space_name,
        checkIn: checkIn,
        CheckOut: checkOut,
        username: username
    })

}
export default sendEmail