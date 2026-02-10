import jwt, { JwtPayload } from "jsonwebtoken";

export class JwtService {
    secret: string

    constructor(secret: string) {
        this.secret = secret
    }

    signToken(userId: number ,email: string){
        const token = jwt.sign({ id: userId, email }, this.secret , { expiresIn: "1d" });
        return token
    }

    verifyToken(token: string, callback: jwt.VerifyCallback){
        jwt.verify(token, this.secret, callback)
    }

    verifyTokenAsync(token: string): Promise<JwtPayload> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, this.secret, (err, decoded) => {
        if (err || !decoded) {
          return reject(err);
        }

        resolve(decoded as JwtPayload);
      });
    });
  }
}