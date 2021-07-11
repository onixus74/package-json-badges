import { invoke } from "@action-badges/core";
import { getAction } from "./lib.js";

(async () => {
  return await invoke(getAction());
})();
