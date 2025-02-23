import { RequestUserInterface } from "../utils/interface/common.interface";

global {
    namespace Express {
        interface Request {
            user: RequestUserInterface
        }
    }
}