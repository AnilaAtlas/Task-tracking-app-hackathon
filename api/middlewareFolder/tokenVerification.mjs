import jwt from "jsonwebtoken";
import "dotenv/config";

const tokenVerification = (req, res, next) => {
    try {
console.log("task hit")
console.log(req.headers?.authorization)
        if (req.headers?.authorization) {
            
            const token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            console.log(decoded,"decode")
            if (decoded) {
                req.user = decoded; // Attach decoded user data (e.g., email) to the request object
                next();
            } else {
                res.status(401).send({ status: 401, message: "Unauthorized Token" });
            }
        } else {
            res.status(401).send({ status: 401, message: "Unauthorized Access" });
        }
    } catch (err) {
        res.status(401).send({ err: err, status: 401, message: "Unauthorized Token" });
    }
};
export default tokenVerification;