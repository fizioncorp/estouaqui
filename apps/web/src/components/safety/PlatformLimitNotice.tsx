import { Alert } from "../ui/Alert";
import { platformNotice } from "../../constants/texts";

export function PlatformLimitNotice() {
  return <Alert>{platformNotice}</Alert>;
}
