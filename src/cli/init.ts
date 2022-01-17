import yargs from "yargs";
import { hideBin } from "yargs/helpers";

const Y = yargs(hideBin(process.argv));
Y.version();

export default Y;
